import prisma from '@/prisma/client';
import {
  checkMethodAllowed,
  createSuccessResponseWithData,
  handlerRequestError
} from "@/app/api/_utils/handleRequest";
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

  // مقادیر اولیه موفق و ناموفق بودن ذخیره کاربر
  let countSuccess = 0;
  let countError = 0;


  try {


    for (const key in body) {
      // استخراج کلید های کاربر
      const { codeMeli, fullName, mobile, email } = body[key];

      // آیا کاربر قبل تر با این کدملی یا موبایل ثبت نام کرده یا خیر؟
      const hasUser = await checkUserExistence(codeMeli, email, mobile);

      if (hasUser === 0) {
        // کاربر وجود ندارد و ایجاد می شود
        countSuccess++;
        await prisma.users.create({
          data: {
            codeMeli: codeMeli,
            fullName: fullName,
            mobile: mobile,
            email: email,
            password: codeMeli,
            catalogId: 1,
          },
        });
      } else {
        countError++;
      }
    }

    return createSuccessResponseWithData({
      // Message: 'کاربران با موفقیت درون ریزی شدند.',
      CountSuccess: countSuccess,
      CountError: countError,
    });

  } catch (error) {
    return handlerRequestError(error);
  }
}