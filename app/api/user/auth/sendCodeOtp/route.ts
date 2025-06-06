import {
    checkMethodAllowed, checkRequiredFields, createErrorResponseWithMessage,
    createSuccessResponseWithData, createSuccessResponseWithMessage,
    handlerRequestError,
} from "@/app/api/_utils/handleRequest";
import prisma from "@/prisma/client";
import {TypeApiConnections} from "@/types/typeApi";
import {callExternalApi, TypeRequestMethod} from "@/app/api/_utils/callExternalApi";
import {TypeHeaders} from "@/types/typeConfig";

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
    const {mobile, code} = body;

    // بررسی وجود داده های ورودی مورد نیاز
    const errorMessage = checkRequiredFields({
        mobile,
        code,
    });

    if (errorMessage) {
        return createErrorResponseWithMessage(errorMessage);
    }

    try {

        // حذف کدهای ارسالی منقضی شده
        await prisma.otpSms.deleteMany({
            where: {
                expires: {
                    lte: Date.now(),
                }
            },
        });

        // آیا کد معتبری قبل تر برای کاربر ارسال شده است یا خیر
        const hasCode = await prisma.otpSms.count({
            where: {
                mobile: body.mobile
            },
        });

        if (hasCode !== 0) {
            return createSuccessResponseWithMessage("ارسال پیام هر 3 دقیقه یکبار انجام می شود. دقایقی دیگر تلاش نمایید.");
        }

        // دریافت داده های ارتباطات
        const connections: TypeApiConnections[] = await prisma.connections.findMany();

        if (!connections || connections[0]) {
            return createErrorResponseWithMessage("دسترسی به ارتباطات مویثر نشد.");
        }

        // ساخت پارامترهای ارسالی به وب سرویس پیامکی
        const params: {
            type: TypeRequestMethod
            data: object | string
            headers: TypeHeaders
        } = getParams(connections[0], body);

        // ساخت آدرس اینترنتی وب سرویس پیامکی
        const URL = getURL(connections[0]);

        // درخواست ارسال پیامک otp به وب سرویس
        const sms = await callExternalApi({
            method: params.type,
            url: URL, // آدرس سرویس خارجی
            ...(params.data && {data: params.data}),
            headers: {
                'Content-Type': 'application/json',
                ...params.headers,
            },
        });

        // بررسی ارسال پیامک
        if (sms.status) {

            // ثبت ارسال کد به کاربر
            await prisma.otpSms.create({
                data: {
                    mobile: body.mobile,
                    expires: Date.now() + 180000,
                },
            });


            return createSuccessResponseWithData(sms.data);
        } else {
            return createErrorResponseWithMessage(sms.errorMessage);
        }

    } catch (error: unknown) {
        return handlerRequestError(error);
    }
}

const getParams = (connections: TypeApiConnections, body: { mobile: string, code: number }): {
    type: TypeRequestMethod;
    data: object | string;
    headers: TypeHeaders;
} => {
    switch (connections.smsName) {
        case "KAVENEGAR":
            return {
                type: 'queryString' as TypeRequestMethod,
                data: {
                    "template": connections.smsCodePattern1,
                    "receptor": body.mobile,
                    "token": body.code.toString(),
                },
                headers: {},
            };
        case "MELIPAYAMAK":
            return {
                type: 'bodyData' as TypeRequestMethod,
                data: JSON.stringify({
                    "bodyId": Number(connections.smsCodePattern1),
                    "to": body.mobile,
                    "args": [body.code.toString()],
                }),
                headers: {},
            };
        case "IPPANEL":
            return {
                type: 'bodyData' as TypeRequestMethod,
                data: {
                    "op": "pattern",
                    "user": connections.smsUserName,
                    "pass": connections.smsPassword,
                    "fromNum": connections.smsFrom,
                    "toNum": body.mobile,
                    "patternCode": connections.smsCodePattern1,
                    "inputData": [{"code": body.code}],
                },
                headers: {},
            };
        case "FARAZSMS":
            return {
                type: 'bodyData' as TypeRequestMethod,
                data: {
                    "code": connections.smsCodePattern1,
                    "sender": connections.smsFrom,
                    "recipient": body.mobile,
                    "variable": {"code": body.code},
                },
                headers: {
                    'apikey': connections.smsToken,
                } as TypeHeaders,
            };
        case "SMSIR":
            return {
                type: 'bodyData' as TypeRequestMethod,
                data: {
                    "TemplateId": Number(connections.smsCodePattern1),
                    "Mobile": body.mobile,
                    "Parameters": [{"name": "code", "value": body.code.toString()}],
                },
                headers: {
                    'X-API-KEY': connections.smsToken,
                } as TypeHeaders,
            };
        default:
            throw new Error('سامانه پیامکی در سیستم ثبت نشده است.');
    }
};
const getURL = (connections: TypeApiConnections) => {
    switch (connections.smsName) {
        case "KAVENEGAR":
            return kaveNegarURL(connections.smsURL!, connections.smsToken!);
        case "MELIPAYAMAK":
            return meliPayamakURL(connections.smsURL!, connections.smsToken!);
        case "IPPANEL":
            return ipPanelURL(connections.smsURL!);
        case "FARAZSMS":
            return farazSmsURL(connections.smsURL!);
        case "SMSIR":
            return smsIrURL(connections.smsURL!);
        default:
            throw new Error('سامانه پیامکی در سیستم ثبت نشده است.');
    }
};
const meliPayamakURL = (baseURL: string, token: string) => baseURL + 'shared/' + token;
const kaveNegarURL = (baseURL: string, token: string) => baseURL + token + '/verify/lookup.json?';
const farazSmsURL = (baseURL: string) => baseURL + '/sms/pattern/normal/send';
const ipPanelURL = (baseURL: string) => baseURL;
const smsIrURL = (baseURL: string) => baseURL + '/send/verify';
