import prisma from '@/prisma/client';
import {
  checkMethodAllowed,
  createErrorResponse, createSuccessResponseWithData,
  getQueryStringByUrl, handlerRequestError,
} from "@/app/api/_utils/handleRequest";

const allowedMethods = ["PATCH" , "PUT"];

export async function DELETE(request: Request) {

  const methodCheckResponse = checkMethodAllowed(request, allowedMethods);
  if (methodCheckResponse) return methodCheckResponse;

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //     return createErrorResponse(authResponse?.message);
  // }

  const body = await request.json();

  const id = getQueryStringByUrl(request.url);

  // بررسی وجود ID
  if (!id) {
    return createErrorResponse("ID Is Required");
  }

  try {

    const updateTimeSheet = await prisma.timeSheets.update({
      data: body,
      where: { id: parseInt(id) },
    });

    return createSuccessResponseWithData(updateTimeSheet);
  } catch (error) {
    return handlerRequestError(error);
  }
}
