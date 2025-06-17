import prisma from '@/prisma/client';
import {checkMethodAllowed, createSuccessResponseWithData, handlerRequestError} from "@/app/api/_utils/handleRequest";
import {TypeApiService, TypeApiUser} from "@/types/typeApiAdmin";

type TypeApiServiceWithInfo = TypeApiService & {
    user: Partial<TypeApiUser>;
};


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
        const services: TypeApiServiceWithInfo[] = await prisma.services.findMany({
            include: {
                user: {
                    select: {
                        fullName: true,
                        mobile: true,
                        email: true,
                    },
                },
            },
        });

        return createSuccessResponseWithData(services);
    } catch (error) {
        return handlerRequestError(error);
    }
}