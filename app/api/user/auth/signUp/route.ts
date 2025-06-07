import {
    checkMethodAllowed, checkRequiredFields, createErrorResponseWithMessage,
    createSuccessResponseWithMessage,
    handlerRequestError,
} from "@/app/api/_utils/handleRequest";
import prisma from "@/prisma/client";
import {checkUserExistence} from "@/app/api/_utils/helperPrisma";

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
    const {codeMeli, fullName, email, mobile, password} = body;

    // بررسی وجود داده های ورودی مورد نیاز
    const errorMessage = checkRequiredFields({
        codeMeli,
        fullName,
        // email, بهتره با تنظیمات بررسی بشه
        mobile,
        password,
    });

    if (errorMessage) {
        return createErrorResponseWithMessage(errorMessage);
    }

    try {

        // آیا کاربر قبل تر با این کدملی یا موبایل ثبت نام کرده یا خیر؟
        const hasUser = await checkUserExistence(codeMeli, email, mobile);

        if (hasUser !== 0) {
            return createErrorResponseWithMessage("کاربر با این کد ملی یا ایمیل یا موبایل وجود دارد. ورود کنید.");
        }

        // ایجاد کاربر جدید
        await prisma.users.create({data: body})

        return createSuccessResponseWithMessage('ثبت نام با موفقیت انجام شد.');

    } catch (error: unknown) {
        return handlerRequestError(error);
    }
}

