import prisma from "@/prisma/client";
import {
  handlerRequestError,
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithMessage
} from "@/app/api/_utils/handleRequest";

const allowedMethods = ["PUT"];

export async function PUT(request: Request) {

  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods);
  if (methodCheckResponse) return methodCheckResponse;

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //     return createErrorResponse(authResponse?.message);
  // }

  // دریافت اطلاعات داخل درخواست
  const body = await request.json();

  const {id , title, code,type,amount} = body;

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    id,
    title,
    code,
    type,
    amount,
  });

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage);
  }

  try {

    // آپدیت کد تخفیف
    await prisma.discounts.update({
      data: body,
      where: { id: parseInt(id) },
    });

    return createSuccessResponseWithMessage("کد تخفیف آپدیت شد.");
  } catch (error) {
    return handlerRequestError(error);
  }
}