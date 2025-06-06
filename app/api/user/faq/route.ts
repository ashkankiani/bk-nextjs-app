import prisma from '@/prisma/client';
import {checkMethodAllowed, createSuccessResponseWithData, handlerRequestError} from "@/app/api/_utils/handleRequest";

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

    try {
        const faqs = await prisma.faqs.findMany();
        return createSuccessResponseWithData(faqs);
    } catch (error) {
        return handlerRequestError(error);
    }
}
