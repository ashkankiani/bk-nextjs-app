import prisma from '@/prisma/client';
import {checkMethodAllowed, createSuccessResponseWithData, handlerRequestError} from "@/app/api/_utils/handleRequest";
import {TypeApiServices, TypeApiUsers} from "@/types/typeApi";

type TypeApiServicesWithInfo = TypeApiServices & {
    user: Partial<TypeApiUsers>;
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
        const services: TypeApiServicesWithInfo[] = await prisma.services.findMany({
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