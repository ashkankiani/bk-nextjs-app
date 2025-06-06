// کامنتش کردم چون تون provider دارمش اینجا واسه چیه ؟؟

import {
    checkMethodAllowed,
    createErrorResponse,
    createSuccessResponseWithData, createSuccessResponseWithMessage,
    handlerRequestError,
} from "@/app/api/_utils/handleRequest";
import prisma from "@/prisma/client";
import {TypeProviderRes} from "@/types/typeApi";
import {encodeJwt} from "@/libs/authentication";
import bcrypt from "bcrypt";

const allowedMethods = ["POST"];

type TypeBody = {
    id?: string
    codeMeli: string
    password: string
    type?: string
    email: string
    mobile?: string
}

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
    const {codeMeli, password, type, email, mobile} = body;


    // بررسی وجود شماره موبایل
    // if (!condition) {
    //     return createErrorResponse("Condition Is Required");
    // }

    try {

        switch (type) {
            case 'LOGIN-OTP':
                await handleLoginOTP(mobile);
                break;
            case 'LOGIN':
                await handleLogin(codeMeli, password);
                break;
            case 'REGISTER':
                await handleRegister(codeMeli, email, mobile, body);
                break;
            case 'RESET-PASSWORD':
                await handleResetPassword(mobile, body);
                break;
            case 'UPDATE':
                await handleUpdate(email, mobile, codeMeli, body);
                break;
        }
        // return createSuccessResponseWithData(timeSheets);
    } catch (error: unknown) {
        return handlerRequestError(error);
    }
}


async function findUserByMobile(mobile: string) {
    return await prisma.users.findUnique({where: {mobile}});
}

async function findUserByCodeMeli(codeMeli: string) {
    return await prisma.users.findUnique({where: {codeMeli}});
}

async function findPermissions(catalogId: number) {
    return await prisma.permissions.findUnique({where: {catalogId}});
}

async function upsertSession(userId: number, session: string, epoch: number) {
    return await prisma.sessions.upsert({
        where: {userId},
        update: {sessionToken: session, expires: epoch},
        create: {sessionToken: session, userId, expires: epoch},
    });
}

async function handleLoginOTP(mobile: string) {
    try {
        const hasUser = await findUserByMobile(mobile);
        if (!hasUser) {
            return createErrorResponse("کاربری با این شماره موبایل یافت نشد.");
        }

        const permissions = await findPermissions(hasUser.catalogId);
        const epoch = Date.now() + 86400000; // One Day
        // const expires = new Date(epoch);

        const user = {
            id: hasUser.id,
            catalogId: hasUser.catalogId,
            codeMeli: hasUser.codeMeli,
            fullName: hasUser.fullName,
            mobile: hasUser.mobile,
            email: hasUser.email,
        };

        if (hasUser.catalogId === 3) {
            const providers: TypeProviderRes[] = await prisma.providers.findMany({where: {userId: hasUser.id}});
            hasUser.providerIds = providers.map(item => item.id);
        }

        const session = await encodeJwt({userId: user.id, catalogId: user.catalogId});

        // res.setHeader('Set-Cookie', `bk-session=${session}; HttpOnly; Path=/; Max-Age=86400`);

        await upsertSession(hasUser.id, session, epoch);

        const response = {...hasUser, permissions};
        return createSuccessResponseWithData(response, 200, {
            'Set-Cookie': `bk-session=${session}; HttpOnly; Path=/; Max-Age=86400`
        });

    } catch (error) {
        return handlerRequestError(error);
    }
}

async function handleLogin(codeMeli: string, password: string) {
    try {
        const hasUser = await findUserByCodeMeli(codeMeli);
        if (!hasUser) {
            return createErrorResponse("کاربری با این کد ملی یافت نشد.");
        }

        const isPasswordValid = await bcrypt.compare(password, hasUser.password);
        if (!isPasswordValid) {
            return createErrorResponse("کلمه عبور برای این کدملی اشتباه است.");
        }

        const permissions = await findPermissions(hasUser.catalogId);
        const epoch = Date.now() + 86400000; // One Day
        // const expires = new Date(epoch);


        const user = {
            id: hasUser.id,
            catalogId: hasUser.catalogId,
            codeMeli: hasUser.codeMeli,
            fullName: hasUser.fullName,
            mobile: hasUser.mobile,
            email: hasUser.email,
        };

        if (hasUser.catalogId === 3) {
            const providers: TypeProviderRes[] = await prisma.providers.findMany({where: {userId: hasUser.id}});
            hasUser.providerIds = providers.map(item => item.id);
        }

        const session = await encodeJwt({userId: user.id, catalogId: user.catalogId});

        // res.setHeader('Set-Cookie', `bk-session=${session}; HttpOnly; Path=/; Max-Age=86400`);


        // const session = await createSession(user, permissions, expires);
        await upsertSession(hasUser.id, session, epoch);

        const response = {...hasUser, permissions};
        return createSuccessResponseWithData(response, 200, {
            'Set-Cookie': `bk-session=${session}; HttpOnly; Path=/; Max-Age=86400`
        });
    } catch (error) {
        return handlerRequestError(error);
    }
}

async function checkUserExistence(codeMeli: string, email: string, mobile: string) {
    return await prisma.users.count({
        where: {
            OR: [
                {codeMeli},
                {email},
                {mobile},
            ],
        },
    });
}

async function createUser(body: TypeBody) {
    delete body.type;
    return await prisma.users.create({data: body});
}

async function handleRegister(codeMeli: string, email: string, mobile: string, body: TypeBody) {
    try {
        const hasUser = await checkUserExistence(codeMeli, email, mobile);
        if (hasUser !== 0) {
            return createErrorResponse("کاربر با این کد ملی یا ایمیل یا موبایل وجود دارد. ورود کنید.");
        }
        await createUser(body);
        return createSuccessResponseWithMessage('ثبت نام با موفقیت انجام شد.');
    } catch (error) {
        return handlerRequestError(error);
    }
}

async function updateUserByMobile(mobile: string, data: TypeBody) {
    delete data.type;
    delete data.mobile;
    return await prisma.users.update({
        data,
        where: {mobile},
    });
}

async function handleResetPassword(mobile: string, body: TypeBody) {
    try {
        const hasUser = await findUserByMobile(mobile);
        if (!hasUser) {
            return createErrorResponse('کاربری با این شماره موبایل یافت نشد.');
        }
        const response = await updateUserByMobile(mobile, body);
        return createSuccessResponseWithData(response);
    } catch (error) {
        return handlerRequestError(error);
    }
}

async function checkUserExistenceForUpdate(email: string, mobile: string, codeMeli: string) {
    return await prisma.users.count({
        where: {
            OR: [
                {email},
                {mobile},
            ],
            NOT: {codeMeli},
        },
    });
}

async function updateUserByCodeMeli(codeMeli: string, data: TypeBody) {
    delete data.type;
    delete data.id;
    return await prisma.users.update({
        data,
        where: {codeMeli},
    });
}

async function handleUpdate(email: string, mobile: string, codeMeli: string, body: TypeBody) {
    try {
        const hasUser = await checkUserExistenceForUpdate(email, mobile, codeMeli);
        if (hasUser !== 0) {
            return createErrorResponse("کاربر با این ایمیل یا موبایل وجود دارد.");
        }

        const response = await updateUserByCodeMeli(codeMeli, body);
        return createSuccessResponseWithData(response);
    } catch (error) {
        return handlerRequestError(error);
    }
}

// export async function encryptJose(payload) {
//   const secretKey = new TextEncoder().encode(process.env.NEXT_JWT_SECRET_KEY)
//
//   return await new SignJWT(payload)
//     .setProtectedHeader({alg: "HS256"})
//     .setIssuedAt()
//     .setExpirationTime("1day")
//     .sign(secretKey);
// }

// export async function createSession(user, permissions, expires) {
//   return await encryptJose({user, permissions, expires})
// }