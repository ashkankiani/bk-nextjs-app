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
    }

    return Response.json({ error: 'Invalid gateway or action' }, { status: 400 })
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
