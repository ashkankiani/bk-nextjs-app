import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithData,
  createSuccessResponseWithMessage,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
import prisma from '@/prisma/client'
import { callExternalApi } from '@/app/api/_utils/callExternalApi'
import { TypeApiConnection } from '@/types/typeApiEntity'

const allowedMethods = ['POST']

export async function POST(request: Request) {
  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods)
  if (methodCheckResponse) return methodCheckResponse
console.log("vvvvvvvvvvvvvvv")
  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //   return createErrorResponse(authResponse?.message);
  // }

  // دریافت اطلاعات داخل درخواست
  const body = await request.json()
  const { type, mobile } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    type,
    mobile,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    // دریافت داده های ارتباطات
    const connections: TypeApiConnection[] = await prisma.connections.findMany()

    if (!connections || !connections[0]) {
      return createErrorResponseWithMessage('دسترسی به ارتباطات مویثر نشد.')
    }

    if (!connections[0].smsURL) {
      return createErrorResponseWithMessage('آدرس وب سرویس پیامک صحیح نیست.')
    }

    let params = {}
    let URL = ''

    switch (connections[0].smsName) {
      case 'KAVENEGAR':
        switch (type) {
          case 'OTP':
            if (!connections[0].smsCodePattern1 || connections[0].smsCodePattern1.length === 0) {
              return createErrorResponseWithMessage('کد پترن smsCodePattern1 برای OTP')
            }
            params = {
              template: connections[0].smsCodePattern1,
              receptor: body.mobile,
              token: body.code.toString(),
            }
            break
          case 'cancellationReservation':
            if (!connections[0].smsCodePattern2 || connections[0].smsCodePattern2.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern2 برای cancellationReservation'
              )
            }
            params = {
              template: connections[0].smsCodePattern2,
              receptor: body.mobile,
              token: body.trackingCode,
              token2: body.date,
              token3: body.time,
            }
            break
          case 'confirmReservation':
            if (!connections[0].smsCodePattern3 || connections[0].smsCodePattern3.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern3 برای confirmReservation'
              )
            }
            params = {
              template: connections[0].smsCodePattern3,
              receptor: body.mobile,
              token: body.trackingCode,
              token2: body.date,
              token3: body.time,
            }
            break
          case 'changeStatusReservation':
            if (!connections[0].smsCodePattern4 || connections[0].smsCodePattern4.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern4 برای changeStatusReservation'
              )
            }
            params = {
              template: connections[0].smsCodePattern4,
              receptor: body.mobile,
              token: body.trackingCode,
              token2: body.date + ' ' + body.time,
              token3: body.status,
            }
            break
          case 'reminderReservation':
            if (!connections[0].smsCodePattern5 || connections[0].smsCodePattern5.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern5 برای reminderReservation'
              )
            }
            params = {
              template: connections[0].smsCodePattern5,
              receptor: body.mobile,
              token: body.trackingCode,
              token2: body.dateName + ' ' + body.date + ' ' + body.time,
              token3: body.service + ' ' + body.provider,
            }
            break
          case 'appreciationReservation':
            if (!connections[0].smsCodePattern6 || connections[0].smsCodePattern6.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern6 برای appreciationReservation'
              )
            }
            params = {
              template: connections[0].smsCodePattern6,
              receptor: body.mobile,
              token: body.fullName,
              token2: body.discountCode,
            }
            break
        }

        if (!connections[0].smsToken) {
          return createErrorResponseWithMessage('توکن وب سرویس پیامک صحیح نیست.')
        }

        URL = kaveNegarURL(connections[0].smsURL, connections[0].smsToken)

        // درخواست ارسال پیامک otp به وب سرویس
        const smsKavenegar = await callExternalApi({
          method: 'queryString',
          url: URL,
          data: params,
        })

        // بررسی ارسال پیامک
        if (smsKavenegar.status) {
          return createSuccessResponseWithData(smsKavenegar.data)
        } else {
          return createErrorResponseWithMessage(smsKavenegar.errorMessage)
        }

      case 'MELIPAYAMAK':
        switch (type) {
          case 'OTP':
            if (!connections[0].smsCodePattern1 || connections[0].smsCodePattern1.length === 0) {
              return createErrorResponseWithMessage('کد پترن smsCodePattern1 برای OTP')
            }
            params = JSON.stringify({
              bodyId: Number(connections[0].smsCodePattern1),
              to: body.mobile,
              args: [body.code.toString()],
            })
            break
          case 'cancellationReservation':
            if (!connections[0].smsCodePattern2 || connections[0].smsCodePattern2.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern2 برای cancellationReservation'
              )
            }
            params = JSON.stringify({
              bodyId: Number(connections[0].smsCodePattern2),
              to: body.mobile,
              args: [body.trackingCode, body.dateName, body.date, body.time],
            })
            break
          case 'confirmReservation':
            if (!connections[0].smsCodePattern3 || connections[0].smsCodePattern3.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern3 برای confirmReservation'
              )
            }
            params = JSON.stringify({
              bodyId: Number(connections[0].smsCodePattern3),
              to: body.mobile,
              args: [
                body.trackingCode,
                body.dateName,
                body.date,
                body.time,
                body.service,
                body.provider,
              ],
            })
            break
          case 'changeStatusReservation':
            if (!connections[0].smsCodePattern4 || connections[0].smsCodePattern4.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern4 برای changeStatusReservation'
              )
            }
            params = JSON.stringify({
              bodyId: Number(connections[0].smsCodePattern4),
              to: body.mobile,
              args: [
                body.trackingCode,
                body.dateName,
                body.date,
                body.time,
                body.service,
                body.provider,
                body.status,
              ],
            })
            break
          case 'reminderReservation':
            if (!connections[0].smsCodePattern5 || connections[0].smsCodePattern5.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern5 برای reminderReservation'
              )
            }
            params = JSON.stringify({
              bodyId: Number(connections[0].smsCodePattern5),
              to: body.mobile,
              args: [
                body.trackingCode,
                body.dateName,
                body.date,
                body.time,
                body.service,
                body.provider,
              ],
            })
            break
          case 'appreciationReservation':
            if (!connections[0].smsCodePattern6 || connections[0].smsCodePattern6.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern6 برای appreciationReservation'
              )
            }
            params = JSON.stringify({
              bodyId: Number(connections[0].smsCodePattern6),
              to: body.mobile,
              args: [body.fullName, body.discountCode],
            })
            break
        }

        if (!connections[0].smsToken) {
          return createErrorResponseWithMessage('توکن وب سرویس پیامک صحیح نیست.')
        }

        URL = meliPayamakURL(connections[0].smsURL, connections[0].smsToken)

        // درخواست ارسال پیامک otp به وب سرویس
        const smsMeliPayamak = await callExternalApi({
          method: 'bodyData',
          url: URL,
          data: params,
        })

        // بررسی ارسال پیامک
        if (smsMeliPayamak.status) {
          return createSuccessResponseWithData(smsMeliPayamak.data)
        } else {
          return createErrorResponseWithMessage(smsMeliPayamak.errorMessage)
        }

      case 'IPPANEL':
        switch (type) {
          case 'OTP':
            if (!connections[0].smsCodePattern1 || connections[0].smsCodePattern1.length === 0) {
              return createErrorResponseWithMessage('کد پترن smsCodePattern1 برای OTP')
            }
            params = {
              op: 'pattern',
              user: connections[0].smsUserName,
              pass: connections[0].smsPassword,
              fromNum: connections[0].smsFrom,
              toNum: body.mobile,
              patternCode: connections[0].smsCodePattern1,
              inputData: [
                {
                  code: body.code,
                },
              ],
            }
            break
          case 'cancellationReservation':
            if (!connections[0].smsCodePattern2 || connections[0].smsCodePattern2.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern2 برای cancellationReservation'
              )
            }
            params = {
              op: 'pattern',
              user: connections[0].smsUserName,
              pass: connections[0].smsPassword,
              fromNum: connections[0].smsFrom,
              toNum: body.mobile,
              patternCode: connections[0].smsCodePattern2,
              inputData: [
                {
                  trackingCode: body.trackingCode,
                  dateName: body.dateName,
                  date: body.date,
                  time: body.time,
                },
              ],
            }
            break
          case 'confirmReservation':
            if (!connections[0].smsCodePattern3 || connections[0].smsCodePattern3.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern3 برای confirmReservation'
              )
            }
            params = {
              op: 'pattern',
              user: connections[0].smsUserName,
              pass: connections[0].smsPassword,
              fromNum: connections[0].smsFrom,
              toNum: body.mobile,
              patternCode: connections[0].smsCodePattern3,
              inputData: [
                {
                  trackingCode: body.trackingCode,
                  dateName: body.dateName,
                  date: body.date,
                  time: body.time,
                  service: body.service,
                  provider: body.provider,
                },
              ],
            }
            break
          case 'changeStatusReservation':
            if (!connections[0].smsCodePattern4 || connections[0].smsCodePattern4.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern4 برای changeStatusReservation'
              )
            }
            params = {
              op: 'pattern',
              user: connections[0].smsUserName,
              pass: connections[0].smsPassword,
              fromNum: connections[0].smsFrom,
              toNum: body.mobile,
              patternCode: connections[0].smsCodePattern4,
              inputData: [
                {
                  trackingCode: body.trackingCode,
                  dateName: body.dateName,
                  date: body.date,
                  time: body.time,
                  service: body.service,
                  provider: body.provider,
                  status: body.status,
                },
              ],
            }
            break
          case 'reminderReservation':
            if (!connections[0].smsCodePattern5 || connections[0].smsCodePattern5.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern5 برای reminderReservation'
              )
            }
            params = {
              op: 'pattern',
              user: connections[0].smsUserName,
              pass: connections[0].smsPassword,
              fromNum: connections[0].smsFrom,
              toNum: body.mobile,
              patternCode: connections[0].smsCodePattern5,
              inputData: [
                {
                  trackingCode: body.trackingCode,
                  dateName: body.dateName,
                  date: body.date,
                  time: body.time,
                  service: body.service,
                  provider: body.provider,
                },
              ],
            }
            break
          case 'appreciationReservation':
            if (!connections[0].smsCodePattern6 || connections[0].smsCodePattern6.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern6 برای appreciationReservation'
              )
            }
            params = {
              op: 'pattern',
              user: connections[0].smsUserName,
              pass: connections[0].smsPassword,
              fromNum: connections[0].smsFrom,
              toNum: body.mobile,
              patternCode: connections[0].smsCodePattern6,
              inputData: [
                {
                  fullName: body.fullName,
                  discountCode: body.discountCode,
                },
              ],
            }
            break
        }
        URL = ipPanelURL(connections[0].smsURL)

        // درخواست ارسال پیامک otp به وب سرویس
        const smsIpPanel = await callExternalApi({
          method: 'bodyData',
          url: URL,
          data: params,
        })

        // بررسی ارسال پیامک
        if (smsIpPanel.status) {
          return createSuccessResponseWithData(smsIpPanel.data)
        } else {
          return createErrorResponseWithMessage(smsIpPanel.errorMessage)
        }

      case 'FARAZSMS':
        switch (type) {
          case 'OTP':
            if (!connections[0].smsCodePattern1 || connections[0].smsCodePattern1.length === 0) {
              return createErrorResponseWithMessage('کد پترن smsCodePattern1 برای OTP')
            }
            params = {
              code: connections[0].smsCodePattern1,
              sender: connections[0].smsFrom,
              recipient: body.mobile,
              variable: {
                code: body.code,
              },
            }
            break
          case 'cancellationReservation':
            if (!connections[0].smsCodePattern2 || connections[0].smsCodePattern2.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern2 برای cancellationReservation'
              )
            }
            params = {
              code: connections[0].smsCodePattern2,
              sender: connections[0].smsFrom,
              recipient: body.mobile,
              variable: {
                trackingCode: body.trackingCode,
                dateName: body.dateName,
                date: body.date,
                time: body.time,
              },
            }
            break
          case 'confirmReservation':
            if (!connections[0].smsCodePattern3 || connections[0].smsCodePattern3.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern3 برای confirmReservation'
              )
            }
            params = {
              code: connections[0].smsCodePattern3,
              sender: connections[0].smsFrom,
              recipient: body.mobile,
              variable: {
                trackingCode: body.trackingCode,
                dateName: body.dateName,
                date: body.date,
                time: body.time,
                service: body.service,
                provider: body.provider,
              },
            }
            break
          case 'changeStatusReservation':
            if (!connections[0].smsCodePattern4 || connections[0].smsCodePattern4.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern4 برای changeStatusReservation'
              )
            }
            params = {
              code: connections[0].smsCodePattern4,
              sender: connections[0].smsFrom,
              recipient: body.mobile,
              variable: {
                trackingCode: body.trackingCode,
                dateName: body.dateName,
                date: body.date,
                time: body.time,
                service: body.service,
                provider: body.provider,
                status: body.status,
              },
            }
            break
          case 'reminderReservation':
            if (!connections[0].smsCodePattern5 || connections[0].smsCodePattern5.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern5 برای reminderReservation'
              )
            }
            params = {
              code: connections[0].smsCodePattern5,
              sender: connections[0].smsFrom,
              recipient: body.mobile,
              variable: {
                trackingCode: body.trackingCode,
                dateName: body.dateName,
                date: body.date,
                time: body.time,
                service: body.service,
                provider: body.provider,
              },
            }
            break
          case 'appreciationReservation':
            if (!connections[0].smsCodePattern6 || connections[0].smsCodePattern6.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern6 برای appreciationReservation'
              )
            }
            params = {
              code: connections[0].smsCodePattern6,
              sender: connections[0].smsFrom,
              recipient: body.mobile,
              variable: {
                fullName: body.fullName,
                discountCode: body.discountCode,
              },
            }
            break
        }

        if (!connections[0].smsToken) {
          return createErrorResponseWithMessage('توکن وب سرویس پیامک صحیح نیست.')
        }

        URL = farazSmsURL(connections[0].smsURL)

        // درخواست ارسال پیامک otp به وب سرویس
        const smsFarazSms = await callExternalApi({
          method: 'bodyData',
          url: URL,
          data: params,
          headers: {
            apikey: connections[0].smsToken,
          },
        })

        // بررسی ارسال پیامک
        if (smsFarazSms.status) {
          return createSuccessResponseWithData(smsFarazSms.data)
        } else {
          return createErrorResponseWithMessage(smsFarazSms.errorMessage)
        }

      case 'SMSIR':
        switch (type) {
          case 'OTP':
            if (!connections[0].smsCodePattern1 || connections[0].smsCodePattern1.length === 0) {
              return createErrorResponseWithMessage('کد پترن smsCodePattern1 برای OTP')
            }
            params = {
              TemplateId: Number(connections[0].smsCodePattern1),
              Mobile: body.mobile,
              Parameters: [
                {
                  name: 'code',
                  value: body.code.toString(),
                },
              ],
            }
            break
          case 'cancellationReservation':
            if (!connections[0].smsCodePattern2 || connections[0].smsCodePattern2.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern2 برای cancellationReservation'
              )
            }
            params = {
              TemplateId: Number(connections[0].smsCodePattern2),
              Mobile: body.mobile,
              Parameters: [
                {
                  name: 'trackingCode',
                  value: body.trackingCode,
                },
                {
                  name: 'dateName',
                  value: body.dateName,
                },
                {
                  name: 'date',
                  value: body.date,
                },
                {
                  name: 'time',
                  value: body.time,
                },
              ],
            }
            break
          case 'confirmReservation':
            if (!connections[0].smsCodePattern3 || connections[0].smsCodePattern3.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern3 برای confirmReservation'
              )
            }
            params = {
              TemplateId: Number(connections[0].smsCodePattern3),
              Mobile: body.mobile,
              Parameters: [
                {
                  name: 'trackingCode',
                  value: body.trackingCode,
                },
                {
                  name: 'dateName',
                  value: body.dateName,
                },
                {
                  name: 'date',
                  value: body.date,
                },
                {
                  name: 'time',
                  value: body.time,
                },
                {
                  name: 'service',
                  value: body.service,
                },
                {
                  name: 'provider',
                  value: body.provider,
                },
              ],
            }
            break
          case 'changeStatusReservation':
            if (!connections[0].smsCodePattern4 || connections[0].smsCodePattern4.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern4 برای changeStatusReservation'
              )
            }
            params = {
              TemplateId: Number(connections[0].smsCodePattern4),
              Mobile: body.mobile,
              Parameters: [
                {
                  name: 'trackingCode',
                  value: body.trackingCode,
                },
                {
                  name: 'dateName',
                  value: body.dateName,
                },
                {
                  name: 'date',
                  value: body.date,
                },
                {
                  name: 'time',
                  value: body.time,
                },
                {
                  name: 'service',
                  value: body.service,
                },
                {
                  name: 'provider',
                  value: body.provider,
                },
                {
                  name: 'status',
                  value: body.status,
                },
              ],
            }
            break
          case 'reminderReservation':
            if (!connections[0].smsCodePattern5 || connections[0].smsCodePattern5.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern5 برای reminderReservation'
              )
            }
            params = {
              TemplateId: Number(connections[0].smsCodePattern5),
              Mobile: body.mobile,
              Parameters: [
                {
                  name: 'trackingCode',
                  value: body.trackingCode,
                },
                {
                  name: 'dateName',
                  value: body.dateName,
                },
                {
                  name: 'date',
                  value: body.date,
                },
                {
                  name: 'time',
                  value: body.time,
                },
                {
                  name: 'service',
                  value: body.service,
                },
                {
                  name: 'provider',
                  value: body.provider,
                },
              ],
            }
            break
          case 'appreciationReservation':
            if (!connections[0].smsCodePattern6 || connections[0].smsCodePattern6.length === 0) {
              return createErrorResponseWithMessage(
                'کد پترن smsCodePattern6 برای appreciationReservation'
              )
            }
            params = {
              TemplateId: Number(connections[0].smsCodePattern6),
              Mobile: body.mobile,
              Parameters: [
                {
                  name: 'fullName',
                  value: body.fullName,
                },
                {
                  name: 'discountCode',
                  value: body.discountCode,
                },
              ],
            }
            break
        }

        URL = smsIrURL(connections[0].smsURL)

        if (!connections[0].smsToken) {
          return createErrorResponseWithMessage('توکن وب سرویس پیامک صحیح نیست.')
        }
console.log(params)
        // درخواست ارسال پیامک otp به وب سرویس
        const smsSmsIr = await callExternalApi({
          method: 'bodyData',
          url: URL,
          data: params,
          headers: {
            'X-API-KEY': connections[0].smsToken,
          },
        })
          console.log(smsSmsIr)
        // بررسی ارسال پیامک
        if (smsSmsIr.status) {
          return createSuccessResponseWithData(smsSmsIr.data)
        } else {
          return createErrorResponseWithMessage(smsSmsIr.errorMessage)
        }
      default:
        return createErrorResponseWithMessage('سامانه پیامکی در سیستم ثبت نشده است.')
    }

    return createSuccessResponseWithMessage('سوال متداول ثبت شد.')
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}

export const kaveNegarURL = (baseURL: string, token: string) => {
  return baseURL + token + '/verify/lookup.json?'
}
export const meliPayamakURL = (baseURL: string, token: string) => {
  return baseURL + '/shared/' + token
}
export const ipPanelURL = (baseURL: string) => {
  return baseURL
}
export const farazSmsURL = (baseURL: string) => {
  return baseURL + '/sms/pattern/normal/send'
}
export const smsIrURL = (baseURL: string) => {
  return baseURL + '/send/verify'
}
