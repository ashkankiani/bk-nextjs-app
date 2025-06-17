import prisma from "@/prisma/client";
import {createSuccessResponseWithData, handlerRequestError, checkMethodAllowed} from "@/app/api/_utils/handleRequest";

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

        // دریافت لیست کاربران به همراه سطح دسترسی
        const users = await prisma.users.findMany(
            {
                include: {
                    catalog: {}
                }
            }
        );

        return createSuccessResponseWithData(users);
    } catch (error) {
        return handlerRequestError(error);
    }
}