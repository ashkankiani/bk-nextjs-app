import {
    checkMethodAllowed,
    checkRequiredFields,
    createErrorResponseWithMessage,
    createSuccessResponseWithData,
    handlerRequestError,
} from "@/app/api/_utils/handleRequest";
import prisma from "@/prisma/client";
import {checkUserExistenceForUpdate} from "@/app/api/_utils/helperPrisma";

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
    const {codeMeli, fullName, email, mobile, gender} = body;

    // بررسی وجود داده های ورودی مورد نیاز
    const errorMessage = checkRequiredFields({
        codeMeli,
        fullName,
        mobile,
        gender,
    });

    if (errorMessage) {
        return createErrorResponseWithMessage(errorMessage);
    }

    try {

        // آیا کاربر قبل تر با این کدملی یا موبایل یا ایمیل ثبت نام کرده یا خیر؟
        const hasUser = await checkUserExistenceForUpdate(email, mobile, codeMeli);

        if (hasUser !== 0) {
            return createErrorResponseWithMessage("کاربر با این ایمیل یا موبایل یا کدملی وجود دارد.");
        }

        // ایجاد عملیات آپدیت
        const response = await prisma.users.update({
            data: body,
            where: {codeMeli}, // {id},
        });

        return createSuccessResponseWithData(response);

    } catch (error: unknown) {
        return handlerRequestError(error);
    }
}

