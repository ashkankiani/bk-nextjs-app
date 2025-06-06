import prisma from '@/prisma/client';
import {
  checkMethodAllowed,
  createErrorResponse, createSuccessResponseWithData,
  getQueryStringByUrl, handlerRequestError,
} from "@/app/api/_utils/handleRequest";

const allowedMethods = ["GET"];

export async function DELETE(request: Request) {

  const methodCheckResponse = checkMethodAllowed(request, allowedMethods);
  if (methodCheckResponse) return methodCheckResponse;

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //     return createErrorResponse(authResponse?.message);
  // }

  const id = getQueryStringByUrl(request.url);

  // بررسی وجود ID
  if (!id) {
    return createErrorResponse("ID Is Required");
  }

  try {

    const timeSheets = await prisma.timeSheets.findMany({
      where: { providerId: parseInt(id) },
    });

    return createSuccessResponseWithData(timeSheets);
  } catch (error) {
    return handlerRequestError(error);
  }
}
