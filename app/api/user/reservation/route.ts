import prisma from "@/prisma/client";
import { fullStringToDateObjectP } from "@/libs/convertor";
import { cookies } from "next/headers";
import {
  createSuccessResponseWithData,
  handlerRequestError,
  checkMethodAllowed,
  serializeBigIntToNumber,
} from "@/app/api/_utils/handleRequest";

const allowedMethods = ["POST", "PUT", "PATCH"];

async function sendRequest(url: string, params: any, cookie: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookie,
      },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (error) {
    throw new Error(error.message || "Internal Server Error");
  }
}

export async function POST(request: Request) {
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods);
  if (methodCheckResponse) return methodCheckResponse;

  try {
    const body = await request.json();
    const { condition } = body;
    const response = await prisma.reservations.findMany(condition);
    return createSuccessResponseWithData(serializeBigIntToNumber(response));
  } catch (error) {
    return handlerRequestError(error);
  }
}

export async function PUT(request: Request) {
  return handleUpdateReservation(request);
}

export async function PATCH(request: Request) {
  return handleUpdateReservation(request);
}

async function handleUpdateReservation(request: Request) {
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods);
  if (methodCheckResponse) return methodCheckResponse;

  try {
    const body = await request.json();
    // لغو رزرو
    await prisma.orders.update({
      data: body.update,
      where: { id: parseInt(body.reserve.orderId) },
    });
    await prisma.reservations.update({
      data: body.update,
      where: { id: parseInt(body.reserve.id) },
    });

    const params = {
      type: "cancellationReservation",
      trackingCode: body.reserve.order.trackingCode,
      dateName: fullStringToDateObjectP(body.reserve.date).weekDay.name,
      date: body.reserve.date,
      time: body.reserve.time.replace("-", " تا "),
      service: body.reserve.order.provider.service.name,
      provider: body.reserve.order.provider.user.fullName,
    };
    const paramsEmail = {
      ...params,
      title: "لغو رزرو! رزرو شما با موفقیت لغو شد.",
      subject: `لغو رزرو ${body.reserve.order.trackingCode}`,
      text: "لغو رزرو! رزرو شما با موفقیت لغو شد.",
    };
    const settings = await prisma.settings.findMany();
    const characterSMS = settings[0].smsCancellationReservation.split("_");
    const characterEmail = settings[0].emailCancellationReservation.split("_");

    // کوکی سشن

    const allCookies = await cookies()
    const session = allCookies.get("bk-session");
    const cookie = session ? `bk-session=${session.value}` : "";

    const sendNotifications = async (roles: string[], params: any, url: string) => {
      for (const role of roles) {
        switch (role) {
          case "ADMIN":
            params.mobile = body.reserve.order.provider.service.user.mobile;
            await sendRequest(url, params, cookie);
            break;
          case "PROVIDER":
            params.mobile = body.reserve.order.provider.user.mobile;
            await sendRequest(url, params, cookie);
            break;
          case "USER":
            params.mobile = body.reserve.order.user.mobile;
            await sendRequest(url, params, cookie);
            break;
        }
      }
    };

    await sendNotifications(characterSMS, params, "/admin/sms");
    await sendNotifications(characterEmail, paramsEmail, "/admin/email");

    return createSuccessResponseWithData({ success: true });
  } catch (error) {
    return handlerRequestError(error);
  }
} 