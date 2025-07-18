import {
  hookAqayePardakhtGetAuthority,
  hookAqayePardakhtGetVerify,
  hookIdPayGetAuthority,
  hookIdPayGetVerify,
  hookZarinpalGetAuthority,
  hookZarinpalGetVerify,
  hookZibalGetAuthority,
  hookZibalGetVerify,
} from '@/hooks/admin/hookGateway'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { gateway, action, params, token } = body

    switch (gateway) {
      case 'ZARINPAL':
        switch (action) {
          case 'verify':
            try {
              return await new Promise(resolve => {
                hookZarinpalGetVerify(params, (response: any, message: any) => {
                  if (response) {
                    resolve(Response.json(message, { status: 200 }))
                  } else {
                    let errors: Record<string, string> = {
                      '-9': 'خطای اعتبار سنجی - مرچنت کد یا آدرس بازگشت',
                      '-10': 'ای پی یا مرچنت كد پذیرنده صحیح نیست.',
                      '-11':
                        'مرچنت کد فعال نیست، پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.',
                      '-12':
                        'تلاش بیش از دفعات مجاز در یک بازه زمانی کوتاه به امور مشتریان زرین پال اطلاع دهید',
                      '-15':
                        'درگاه پرداخت به حالت تعلیق در آمده است، پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.',
                      '-16': 'سطح تایید پذیرنده پایین تر از سطح نقره ای است.',
                      '-17': 'محدودیت پذیرنده در سطح آبی',
                      '-50': 'مبلغ پرداخت شده با مقدار مبلغ ارسالی در متد وریفای متفاوت است.',
                      '-51': 'پرداخت ناموفق',
                      '-52':
                        'خطای غیر منتظره‌ای رخ داده است. پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.',
                      '-53': 'پرداخت متعلق به این مرچنت کد نیست.',
                      '-54': 'اتوریتی نامعتبر است.',
                      '-55': 'تراکنش مورد نظر یافت نشد',
                      '101': 'تراکنش وریفای شده است.',
                    }
                    resolve(Response.json({ error: errors[message.code] }, { status: 201 }))
                  }
                })
              })
            } catch {
              return Response.json({ error: 'Failed to Verify Zarinpal' }, { status: 500 })
            }
        }
        break
      case 'IDPAY':
        switch (action) {
          case 'verify':
            try {
              return await new Promise(resolve => {
                hookIdPayGetVerify(params, (response: any, message: any) => {
                  if (response) {
                    resolve(Response.json(message, { status: 200 }))
                  } else {
                    resolve(
                      Response.json(
                        { error: 'سفارش پرداخت نشده یا ناموفق بوده است.' },
                        { status: 201 }
                      )
                    )
                  }
                })
              })
            } catch {
              return Response.json({ error: 'Failed to Verify IDPAY' }, { status: 500 })
            }
        }
        break
      case 'AQAYEPARDAKHT':
        switch (action) {
          case 'verify':
            try {
              return await new Promise(resolve => {
                hookAqayePardakhtGetVerify(params, (response: any, message: any) => {
                  if (response) {
                    resolve(Response.json(message, { status: 200 }))
                  } else {
                    let errors: Record<string, string> = {
                      '-1': 'amount نمی تواند خالی باشد',
                      '-2': 'کد پین درگاه نمی تواند خالی باشد',
                      '-3': 'callback نمی تواند خالی باشد',
                      '-4': 'amount باید عددی باشد',
                      '-5': 'amount باید بین 1,000 تا 200,000,000 تومان باشد',
                      '-6': 'کد پین درگاه اشتباه هست',
                      '-7': 'transid نمی تواند خالی باشد',
                      '-8': 'تراکنش مورد نظر وجود ندارد',
                      '-9': 'کد پین درگاه با درگاه تراکنش مطابقت ندارد',
                      '-10': 'مبلغ با مبلغ تراکنش مطابقت ندارد',
                      '-11': 'درگاه درانتظار تایید و یا غیر فعال است',
                      '-12': 'امکان ارسال درخواست برای این پذیرنده وجود ندارد',
                      '-13': 'شماره کارت باید 16 رقم چسبیده بهم باشد',
                      '-14': 'درگاه برروی سایت دیگری درحال استفاده است',
                    }
                    resolve(Response.json({ error: errors[message.code] }, { status: 201 }))
                  }
                })
              })
            } catch {
              return Response.json({ error: 'Failed to Verify Aqaye Pardakht' }, { status: 500 })
            }
        }
        break
      case 'ZIBAL':
        switch (action) {
          case 'verify':
            try {
              return await new Promise(resolve => {
                hookZibalGetVerify(params, (response: any, message: any) => {
                  if (response) {
                    resolve(Response.json(message, { status: 200 }))
                  } else {
                    let errors: Record<string, string> = {
                      102: 'مرچند یافت نشد.',
                      103: 'مرچند غیرفعال است.',
                      104: 'مرچند نامعتبر است.',
                      202: 'سفارش پرداخت نشده یا ناموفق بوده است.',
                      203: 'کد پیگیری نامعتبر می‌باشد.',
                    }
                    resolve(Response.json({ error: errors[message.result] }, { status: 201 }))
                  }
                })
              })
            } catch {
              return Response.json({ error: 'Failed to Verify Zibal' }, { status: 500 })
            }
        }
        break
    }

    return Response.json({ error: 'Invalid gateway or action' }, { status: 400 })
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
