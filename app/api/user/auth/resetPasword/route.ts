import {
    checkMethodAllowed, checkRequiredFields, createErrorResponseWithMessage,
    createSuccessResponseWithMessage,
    handlerRequestError,
} from "@/app/api/_utils/handleRequest";
import prisma from "@/prisma/client";

import {findUserByMobile} from "@/app/api/_utils/helperPrisma";

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
    const {mobile, password} = body;

    // بررسی وجود داده های ورودی مورد نیاز
    const errorMessage = checkRequiredFields({
        mobile,
        password,
    });

    if (errorMessage) {
        return createErrorResponseWithMessage(errorMessage);
    }

    try {

        // بررسی وجود کاربر با این موبایل
        const hasUser = await findUserByMobile(mobile);

        if (!hasUser) {
            return createErrorResponseWithMessage('کاربری با این شماره موبایل یافت نشد.');
        }

        await prisma.users.update({
            data: body,
            where: {mobile},
        });

        return createSuccessResponseWithMessage('کلمه عبور با موفقیت تغییر یافت.');
    } catch (error: unknown) {
        return handlerRequestError(error);
    }
}

