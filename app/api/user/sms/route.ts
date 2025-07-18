import prisma from '@/prisma/client'
import axios from 'axios'
import QS from 'qs'
import {
  checkMethodAllowed,
  createErrorResponse,
  createSuccessResponseWithData,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
import { TypeConnectionsRes } from '@/types/typeApiAdmin'

const allowedMethods = ['POST']

export async function POST(request: Request) {
  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods)
  if (methodCheckResponse) return methodCheckResponse

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //   return createErrorResponse(authResponse?.message);
  // }

  // دریافت اطلاعات داخل درخواست
  const body = await request.json()

  try {
    await prisma.otpSms.deleteMany({
      where: {
        expires: {
          lte: Date.now(),
        },
      },
    })

    const hasCode = await prisma.otpSms.count({
      where: {
        mobile: body.mobile,
      },
    })

    if (hasCode !== 0) {
      return createSuccessResponseWithData(
        'ارسال پیام هر 3 دقیقه یکبار انجام می شود. دقایقی دیگر تلاش نمایید.'
      )

      // res.status(200).json({
      //     status: false,
      //     message: "ارسال پیام هر 3 دقیقه یکبار انجام می شود. دقایقی دیگر تلاش نمایید."
      // });
    } else {
      // // eslint-disable-next-line no-undef
      // BigInt.prototype.toJSON = function () {
      //   const int = Number.parseInt(this.toString());
      //   return int ?? this.toString();
      // };
      //
      // // تبدیل BigInt به عدد برای ارسال به کلاینت
      // const safeSession = session ? serializeBigIntToNumber(session) : null;

      const otpSms = await prisma.otpSms.create({
        data: {
          mobile: body.mobile,
          expires: Date.now() + 180000,
        },
      })

      let connections = await prisma.connections.findMany()
      connections = connections[0]

      const params = getParams(connections, body)
      const URL = getURL(connections)

      const sms = await sendRequest(params.type, URL, params.data, {
        headers: {
          'Content-Type': 'application/json',
          ...params.headers,
        },
      })

      if (sms.status) {
        return createSuccessResponseWithData(otpSms)
        // res.status(200).json({status: true, data: otpSms, message: "کد یکبار مصرف با موفقیت ارسال شد."});
      } else {
        return createErrorResponse(sms.error)
        // res.status(500).json({status: false, message: sms.error});
      }
    }
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}

const getParams = (connections: TypeConnectionsRes, body) => {
  switch (connections.smsName) {
    case 'KAVENEGAR':
      return {
        type: 'queryString',
        data: {
          template: connections.smsCodePattern1,
          receptor: body.mobile,
          token: body.code.toString(),
        },
        headers: {},
      }
    case 'MELIPAYAMAK':
      return {
        type: 'bodyData',
        data: JSON.stringify({
          bodyId: Number(connections.smsCodePattern1),
          to: body.mobile,
          args: [body.code.toString()],
        }),
        headers: {},
      }
    case 'IPPANEL':
      return {
        type: 'bodyData',
        data: {
          op: 'pattern',
          user: connections.smsUserName,
          pass: connections.smsPassword,
          fromNum: connections.smsFrom,
          toNum: body.mobile,
          patternCode: connections.smsCodePattern1,
          inputData: [{ code: body.code }],
        },
        headers: {},
      }
    case 'FARAZSMS':
      return {
        type: 'bodyData',
        data: {
          code: connections.smsCodePattern1,
          sender: connections.smsFrom,
          recipient: body.mobile,
          variable: { code: body.code },
        },
        headers: {
          apikey: connections.smsToken,
        },
      }
    case 'SMSIR':
      return {
        type: 'bodyData',
        data: {
          TemplateId: Number(connections.smsCodePattern1),
          Mobile: body.mobile,
          Parameters: [{ name: 'code', value: body.code.toString() }],
        },
        headers: {
          'X-API-KEY': connections.smsToken,
        },
      }
    default:
      throw new Error('سامانه پیامکی در سیستم ثبت نشده است.')
  }
}

const getURL = (connections: TypeConnectionsRes) => {
  switch (connections.smsName) {
    case 'KAVENEGAR':
      return kaveNegarURL(connections.smsURL!, connections.smsToken!)
    case 'MELIPAYAMAK':
      return meliPayamakURL(connections.smsURL!, connections.smsToken!)
    case 'IPPANEL':
      return ipPanelURL(connections.smsURL!)
    case 'FARAZSMS':
      return farazSmsURL(connections.smsURL!)
    case 'SMSIR':
      return smsIrURL(connections.smsURL!)
    default:
      throw new Error('سامانه پیامکی در سیستم ثبت نشده است.')
  }
}

const sendRequest = (method, url, data, headers) => {
  return new Promise((resolve, reject) => {
    switch (method) {
      case 'queryString':
        axios
          .post(url + QS.stringify(data), {}, headers)
          .then(response => resolve({ status: true, data: response.data }))
          .catch(error => reject({ status: false, error }))
        break
      case 'bodyData':
        axios
          .post(url, data, headers)
          .then(response => resolve({ status: true, data: response.data }))
          .catch(error => reject({ status: false, error }))
        break
      default:
        reject({ status: false, message: 'Invalid method' })
    }
  })
}

const meliPayamakURL = (baseURL: string, token: string) => baseURL + 'shared/' + token
const kaveNegarURL = (baseURL: string, token: string) => baseURL + token + '/verify/lookup.json?'
const farazSmsURL = (baseURL: string) => baseURL + '/sms/pattern/normal/send'
const ipPanelURL = (baseURL: string) => baseURL
const smsIrURL = (baseURL: string) => baseURL + '/send/verify'
