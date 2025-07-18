import prisma from '@/prisma/client'
import {
  createSuccessResponseWithData,
  handlerRequestError,
  checkMethodAllowed,
} from '@/app/api/_utils/handleRequest'
import { textBankName } from '@/libs/utility'

const allowedMethods = ['GET']

export async function GET(request: Request) {
  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods)
  if (methodCheckResponse) return methodCheckResponse

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //     return createErrorResponse(authResponse?.message);
  // }

  try {
    // دریافت لیست ارتباطات
    const connections = await prisma.connections.findMany()

    // دریافت لیست درگاه های بانک فعال
    const listGateways = []

    if (connections[0].bankName1 !== 'NONE' && connections[0].merchantId1 !== '') {
      listGateways.push({
        key: connections[0].bankName1,
        title: textBankName(connections[0].bankName1),
        type: 'OnlinePayment',
      })
    }

    if (connections[0].bankName2 !== 'NONE' && connections[0].merchantId2 !== '') {
      listGateways.push({
        key: connections[0].bankName2,
        title: textBankName(connections[0].bankName2),
        type: 'OnlinePayment',
      })
    }

    return createSuccessResponseWithData(listGateways)
  } catch (error) {
    return handlerRequestError(error)
  }
}
