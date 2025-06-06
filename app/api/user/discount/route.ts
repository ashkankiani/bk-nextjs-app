import prisma from '@/prisma/client';
import {
    checkMethodAllowed,
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

    // دریافت اطلاعات داخل درخواست
    const code = getQueryStringByUrl(request.url, "code");

    try {
        if (code) {
            const discount = await prisma.discounts.findMany({
                where: {
                    code: code
                }
            });
            return createSuccessResponseWithData(discount);
        } else {
            return handlerRequestError("Request Query Invalid");
        }
    } catch (error) {
        return handlerRequestError(error);
    }
}
