import {
    checkMethodAllowed,
    checkRequiredFields,
    createErrorResponseWithMessage,
    createSuccessResponseWithMessage,
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

    // catch (error: any) {
    //         console.error('Error updating user:', error);
    //         let myError = error?.meta?.target;
    //         let message = '';
    //         switch (myError) {
    //             case 'Users_codeMeli_key':
    //                 message = 'کاربری با این کدملی وجود دارد.';
    //                 break;
    //             case 'Users_mobile_key':
    //                 message = 'کاربری با این موبایل وجود دارد.';
    //                 break;
    //             case 'Users_email_key':
    //                 message = 'کاربری با این ایمیل وجود دارد.';
    //                 break;
    //             default:
    //                 message = 'Failed to update';
    //         }

        // آیا کاربر قبل تر با این کدملی یا موبایل یا ایمیل ثبت نام کرده یا خیر؟
        const hasUser = await checkUserExistenceForUpdate(codeMeli, email, mobile);

        if (hasUser !== 0) {
            return createErrorResponseWithMessage("کاربر با این ایمیل یا موبایل یا کدملی وجود دارد.");
        }

        // ایجاد عملیات آپدیت کاربر
        await prisma.users.update({
            data: body,
            where: {codeMeli}, // {id},
        });

        return createSuccessResponseWithMessage("کاربر آپدیت شد.");

    } catch (error: unknown) {
        return handlerRequestError(error);
    }
}

