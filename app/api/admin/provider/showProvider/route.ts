import prisma from "@/prisma/client";
import {
  createSuccessResponseWithData,
  handlerRequestError,
  checkMethodAllowed,
  getQueryStringByUrl, createErrorResponseWithMessage
} from "@/app/api/_utils/handleRequest";

const allowedMethods = ["GET"];

export async function GET(request: Request) {

  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods);
  if (methodCheckResponse) return methodCheckResponse;

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //     return createErrorResponse(authResponse?.message);
  // }

  // دریافت Id درخواست
  const id = getQueryStringByUrl(request.url);

  // بررسی وجود ID
  if (!id) {
    return createErrorResponseWithMessage("آیدی ضروری است.");
  }

  try {

    // دریافت ارائه دهنده
    const provider = await prisma.providers.findUnique({
      where: { id: parseInt(id) },
      include: {
        service: { select: { id: true, name: true, price: true } },
        user: { select: { fullName: true } },
      },
    });

    return createSuccessResponseWithData(provider);
  } catch (error) {
    return handlerRequestError(error);
  }
}