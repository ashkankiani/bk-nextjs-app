import prisma from '@/prisma/client'
import { fullStringToDateObjectP } from '@/libs/convertor'
import { bkRequest } from '@/api/api'
import { createSuccessResponseWithData, handlerRequestError } from '@/app/api/_utils/handleRequest'
import { NextRequest } from 'next/server'

const sendRequest = async (url: string, params: any, cookie: string) => {
  try {
    const response = await bkRequest.post(url, params, {
      headers: {
        Cookie: cookie,
      },
    })
    return { status: response.status, data: response.data }
  } catch (error) {
    return handlerRequestError(error)
  }
}

export async function POST(req: NextRequest) {
  const cookie = req.headers.get('cookie') || ''
  const body = await req.json()

  let responseTransaction = null

  if (body.shouldExecuteTransaction) {
    const paramsTransaction = {
      bankName: body.bankName,
      trackId: body.trackId,
      amount: body.amount,
      cardNumber: body.cardNumber,
      authority: body.authority,
    }

    try {
      responseTransaction = await prisma.transaction.create({ data: paramsTransaction })
    } catch (error) {
      return handlerRequestError(error)
    }
  }

  const paramsPayment = {
    paymentType: body.paymentType,
    userId: body.user.id,
    description: body.description,
    transactionId: body.shouldExecuteTransaction ? responseTransaction.id : null,
  }

  let responsePayments
  try {
    responsePayments = await prisma.payments.create({ data: paramsPayment })
  } catch (error) {
    return handlerRequestError(error)
  }

  const paramsOrder = {
    trackingCode: body.trackingCode,
    status: body.status,
    userId: body.user.id,
    serviceId: body.service.id,
    providerId: body.provider.id,
    discountId: body.discountId,
    paymentId: responsePayments.id,
    price: body.price,
    discountPrice: body.discountPrice,
    totalPrice: body.totalPrice,
  }

  let responseOrders
  try {
    responseOrders = await prisma.orders.create({ data: paramsOrder })
  } catch (error) {
    return handlerRequestError(error)
  }

  // eslint-disable-next-line no-undef
  ;(BigInt.prototype as any).toJSON = function () {
    return Number.parseInt(this.toString()) ?? this.toString()
  }

  const time = body.time.split('-')
  const paramsReservation = {
    userId: body.user.id,
    orderId: responseOrders.id,
    paymentId: responsePayments.id,
    serviceId: body.service.id,
    providerId: body.provider.id,
    transactionId: body.shouldExecuteTransaction ? responseTransaction.id : null,
    dateTimeStartEpoch: fullStringToDateObjectP(
      `${body.date} ${parseInt(time[0].split(':')[0])}:${parseInt(time[0].split(':')[1])}`,
      'YYYY/MM/DD HH:mm'
    ).valueOf(),
    dateTimeEndEpoch: fullStringToDateObjectP(
      `${body.date} ${parseInt(time[1].split(':')[0])}:${parseInt(time[1].split(':')[1])}`,
      'YYYY/MM/DD HH:mm'
    ).valueOf(),
    date: body.date,
    time: body.time,
    status: body.status,
  }

  let responseReservations
  try {
    responseReservations = await prisma.reservations.create({ data: paramsReservation })
  } catch (error) {
    return handlerRequestError(error)
  }

  const params = {
    type: 'confirmReservation',
    trackingCode: body.trackingCode,
    dateName: fullStringToDateObjectP(body.date).weekDay.name,
    date: body.date,
    time: body.time.replace('-', ' تا '),
    service: body.service.name,
    provider: body.provider.user.fullName,
  }

  if (body.status === 'COMPLETED') {
    const sendSmsNotifications = async (mobile: string) => {
      await sendRequest('/admin/sms', { ...params, mobile }, cookie)
    }
    const sendEmailNotifications = async (email: string) => {
      await sendRequest(
        '/admin/email',
        {
          ...params,
          email,
          title: 'تبریک! رزرو شما با موفقیت ثبت شد.',
          subject: `رزرو جدید ${body.trackingCode}`,
          text: 'تبریک! یک سفارش جدید ثبت شد.',
        },
        cookie
      )
    }

    if (body.service.smsToAdminService) {
      await sendSmsNotifications(body.service.user.mobile)
    }
    if (body.service.smsToAdminProvider) {
      await sendSmsNotifications(body.provider.user.mobile)
    }
    if (body.service.smsToUserService) {
      await sendSmsNotifications(body.user.mobile)
    }

    if (body.service.emailToAdminService) {
      await sendEmailNotifications(body.service.user.email)
    }
    if (body.service.emailToAdminProvider) {
      await sendEmailNotifications(body.provider.user.email)
    }
    if (body.service.emailToUserService) {
      await sendEmailNotifications(body.user.email)
    }
  }

  const paramsDraft = {
    userId: body.user.id,
    serviceId: body.service.id,
    providerId: body.provider.id,
    date: body.date,
    time: body.time,
  }
  try {
    await prisma.drafts.deleteMany({ where: paramsDraft })
    return createSuccessResponseWithData(responseReservations)
  } catch (error) {
    return handlerRequestError(error)
  }
}
