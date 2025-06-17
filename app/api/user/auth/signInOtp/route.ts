import {
    checkMethodAllowed, checkRequiredFields, createErrorResponseWithMessage,
    createSuccessResponseWithData,
    handlerRequestError,
} from "@/app/api/_utils/handleRequest";
import prisma from "@/prisma/client";
import {encodeJwt} from "@/libs/authentication";
import {findPermissions, findUserByMobile, upsertSession} from "@/app/api/_utils/helperPrisma";
import {TypeApiProviders} from "@/types/typeApiAdmin";

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
    const {mobile , otp} = body;

    // بررسی وجود داده های ورودی مورد نیاز
    const errorMessage = checkRequiredFields({
        mobile,
        otp,
    });

    if (errorMessage) {
        return createErrorResponseWithMessage(errorMessage);
    }

    try {

        // بررسی وجود کاربر با این کدملی
        const hasUser = await findUserByMobile(mobile);

        if (!hasUser) {
            return createErrorResponseWithMessage("کاربری با این شماره موبایل یافت نشد.");
        }

        // دریافت مجوزهای کاربر
        const permissions = await findPermissions(hasUser.catalogId);

        // مدت زمان برای نشست
        const epoch = Date.now() + 86400000; // One Day
        // const expires = new Date(epoch);

        // ساخت داده خروجی کاربر
        const user: {
            id: number;
            catalogId: number;
            codeMeli: string;
            fullName: string;
            mobile: string;
            email: string | null;
            providerIds?: number[];
        } = {
            id: hasUser.id,
            catalogId: hasUser.catalogId,
            codeMeli: hasUser.codeMeli,
            fullName: hasUser.fullName,
            mobile: hasUser.mobile,
            email: hasUser.email,
        };

        // اگر کاربر ما Provider باشد باید لیست ایدی هایی که اپراتور آن است را برگردانیم
        if (hasUser.catalogId === 3) {
            const providers: TypeApiProviders[] = await prisma.providers.findMany({where: {userId: hasUser.id}});
            user.providerIds = providers.map(item => item.id);
        }

        // ایجاد نشست
        const session = await encodeJwt({userId: user.id, catalogId: user.catalogId});

        // ذخیره سازی نشست یا تمدید آن
        await upsertSession(user.id, session, epoch);

        // ایجاد پاسخ به درخواست
        const response = {...user, permissions};

        return createSuccessResponseWithData(response, {
            'Set-Cookie': `bk-session=${session}; HttpOnly; Path=/; Max-Age=86400`
        });

    } catch (error: unknown) {
        return handlerRequestError(error);
    }
}

