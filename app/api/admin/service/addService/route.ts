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
    const {
        userId,
        name,
        periodTime,
        price,
        capacity,
        gender,
        codPayment,
        onlinePayment,
        smsToAdminService,
        smsToAdminProvider,
        smsToUserService,
        emailToAdminService,
        emailToAdminProvider,
        emailToUserService
    } = body;

    // بررسی وجود داده های ورودی مورد نیاز
    const errorMessage = checkRequiredFields({
        userId,
        name,
        periodTime,
        price,
        capacity,
        gender,
        codPayment,
        onlinePayment,
        smsToAdminService,
        smsToAdminProvider,
        smsToUserService,
        emailToAdminService,
        emailToAdminProvider,
        emailToUserService
    });

    if (errorMessage) {
        return createErrorResponseWithMessage(errorMessage);
    }

    try {

        // ثبت سرویس جدید
        await prisma.services.create({
            data: body,
        });

        return createSuccessResponseWithMessage('سرویس ثبت شد.');
    } catch (error: unknown) {
        return handlerRequestError(error);
    }
}