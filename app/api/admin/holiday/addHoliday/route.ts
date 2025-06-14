import {
  checkMethodAllowed, checkRequiredFields, createErrorResponseWithMessage,
  createSuccessResponseWithMessage,
  handlerRequestError,
} from "@/app/api/_utils/handleRequest";
import prisma from "@/prisma/client";

const allowedMethods = ["POST"];

export async function POST(request: Request) {
  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods);
  if (methodCheckResponse) return methodCheckResponse;

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //   return createErrorResponse(authResponse?.message);
  // }

  // دریافت اطلاعات داخل درخواست
  const body = await request.json();
  const {date, title} = body;

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    date,
    title,
  });

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage);
  }

  try {

    // ثبت تعطیلی جدید
    await prisma.holidays.create({
      data: body,
    });

    return createSuccessResponseWithMessage('تعطیلی ثبت شد.');
  } catch (error: unknown) {
    return handlerRequestError(error);
  }
}