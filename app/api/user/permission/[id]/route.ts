import prisma from '@/prisma/client';
import {
    checkMethodAllowed,
    createErrorResponseWithMessage,
    createSuccessResponseWithData,
    getQueryStringByUrl,
    handlerRequestError
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

    const id = getQueryStringByUrl(request.url);


    // بررسی وجود ID
    if (!id) {
        return createErrorResponseWithMessage("آیدی ضروری است.");
    }

    try {

        const permission = await prisma.permissions.findFirst({
            where: {
                catalogId: parseInt(id),
            },
        });
        return createSuccessResponseWithData(permission);




    } catch (error) {
        return handlerRequestError(error);
    }
}
