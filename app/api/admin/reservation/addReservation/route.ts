import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithMessage,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
import prisma from '@/prisma/client'
import { fullStringToDateObjectP } from '@/libs/convertor'
import { callInternalApi } from '@/app/api/_utils/callInternalApi'

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
  const { shouldExecuteTransaction } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    shouldExecuteTransaction,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    let responseTransaction = null

    if (body.shouldExecuteTransaction) {
      const { bankName, trackId, amount, cardNumber, authority } = body

      // بررسی وجود داده های ورودی مورد نیاز
      const errorMessage = checkRequiredFields({
        bankName,
        trackId,
        amount,
        cardNumber,
        authority,
      })

      if (errorMessage) {
        return createErrorResponseWithMessage(errorMessage)
      }

      const paramsTransaction = {
        bankName: body.bankName,
        trackId: body.trackId,
        amount: body.amount,
        cardNumber: body.cardNumber,
        authority: body.authority,
      }

      responseTransaction = await prisma.transaction.create({
        data: paramsTransaction,
      })
    }

    const paramsPayment = {
      paymentType: body.paymentType,
      userId: body.user.id,
      description: body.description,
      transactionId:
        body.shouldExecuteTransaction && responseTransaction ? responseTransaction.id : null,
    }

    const responsePayments = await prisma.payments.create({
      data: paramsPayment,
    })
    const paramsOrder = {
      // trackingCode: body.trackingCode ? body.trackingCode : customTrackingCode,
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
      // discountCode: body.discountCode,
      // discountType: body.discountType,
    }

    const responseOrders = await prisma.orders.create({
      data: paramsOrder,
    })
    // eslint-disable-next-line no-undef
    BigInt.prototype.toJSON = function () {
      const int = Number.parseInt(this.toString())
      return int ?? this.toString()
    }
    let time = body.time.split('-')
    let paramsReservation = {
      userId: body.user.id,
      orderId: responseOrders.id,
      paymentId: responsePayments.id,
      serviceId: body.service.id,
      providerId: body.provider.id,
      transactionId: body.shouldExecuteTransaction ? responseTransaction.id : null,
      dateTimeStartEpoch: parseInt(
        fullStringToDateObjectP(
          body.date + ' ' + parseInt(time[0].split(':')[0]) + ':' + parseInt(time[0].split(':')[1]),
          'YYYY/MM/DD HH:mm'
        ).valueOf()
      ),
      dateTimeEndEpoch: parseInt(
        fullStringToDateObjectP(
          body.date + ' ' + parseInt(time[1].split(':')[0]) + ':' + parseInt(time[1].split(':')[1]),
          'YYYY/MM/DD HH:mm'
        ).valueOf()
      ),
      date: body.date, // format "1403/04/13"
      time: body.time, // format "15:00-16:00"
      status: body.status,
    }
    const responseReservations = await prisma.reservations.create({
      data: paramsReservation,
    })

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
        await callInternalApi('/admin/sms/send-sms', {
          method: 'POST',
          body: { ...params, mobile },
        })
      }
      const sendEmailNotifications = async (email: string) => {
        await callInternalApi('/admin/email/send-email', {
          ...params,
          email,
          title: 'تبریک! رزرو شما با موفقیت ثبت شد.',
          subject: `رزرو جدید ${body.trackingCode}`,
          text: 'تبریک! یک سفارش جدید ثبت شد.',
        })
      }

      if (body.smsToAdminService) {
        await sendSmsNotifications(body.service.user.mobile)
      }
      if (body.smsToAdminProvider) {
        await sendSmsNotifications(body.provider.user.mobile)
      }
      if (body.smsToUserService) {
        await sendSmsNotifications(body.user.mobile)
      }

      if (body.emailToAdminService) {
        await sendEmailNotifications(body.service.user.email)
      }
      if (body.emailToAdminProvider) {
        await sendEmailNotifications(body.provider.user.email)
      }
      if (body.emailToUserService) {
        await sendEmailNotifications(body.user.email)
      }
    }

    const paramsDraft = {
      userId: body.user.id,
      serviceId: body.service.id,
      providerId: body.provider.id,
      date: body.date, // format "1403/04/13"
      time: body.time, // format "15:00-16:00"
    }

    await prisma.drafts.deleteMany({
      where: paramsDraft,
    })
    // res.status(200).json(responseReservations);

    return createSuccessResponseWithMessage('رزرو ثبت شد.')
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}
