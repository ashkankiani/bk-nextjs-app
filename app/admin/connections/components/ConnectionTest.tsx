import React, { useState } from 'react'
import { bkToast, onlyTypeNumber } from '@/libs/utility'
import TheSpinner from '@/components/layout/TheSpinner'
import { FaSms } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import useHook from '@/hooks/controller/useHook'
import { useSendEmail } from '@/hooks/admin/useEmail'
import { useSendSms } from '@/hooks/admin/useSms'

export default function ConnectionTest() {
  const { permissions } = useHook()

  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')

  const { mutateAsync: mutateAsyncSendEmail, isPending: isPendingSendEmail } = useSendEmail()
  const { mutateAsync: mutateAsyncSendSms, isPending: isPendingSendSms } = useSendSms()

  const handlerTestEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    // اینجا باید صحت سنجی ایمیل رو بزارم
    const data = {
      title: 'تبریک! میل سرور شما صحیح کار میکند.',
      subject: 'ایمیل تست از رزرواسیون کیان',
      text: 'پیکربندی شما برای ارسال ایمیل صحیح است.',
      email: email,
      trackingCode: '123456',
      dateName: 'شنبه',
      date: '1404/01/01',
      time: '10:00 تا 11:00',
      service: 'رزرواسیون کیان',
      provider: 'اشکان کیانی',
    }

    await mutateAsyncSendEmail(data)
      .then(res => {
        bkToast('success', res.Message)
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  const handlerTestSms = async (e: React.FormEvent) => {
    e.preventDefault()

    // اینجا باید صحت سنجی کوبایل رو بزارم
    const data = {
      type: 'OTP',
      mobile: mobile,
      code: '123456',
    }

    await mutateAsyncSendSms(data)
      .then(res => {
        // خروجی res رو ببینم
        console.log(res)
        bkToast('success', 'پیامک با موفقیت ارسال شد.')
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  return (
    <>
      {permissions.editConnections && (
        <>
          <div className="my-4 w-full p-4">
            <hr className="panel-section-separator" />
          </div>
          <div className="panel-col-100">
            <div className="prose prose-sm max-w-full text-neutral-800 dark:text-white">
              <p className="font-bold text-primary-800">تست اتصالات</p>
              <p>
                برای اینکه از اتصال سامانه پیامکی و ایمیل خود مطمن شوید میتوانید از این بخش استفاده
                کنید. توجه فرمایید ثبت <strong>کد پترن پیامک یکبار مصرف</strong> ضروری است.
              </p>
            </div>

            <form onSubmit={handlerTestSms} className="flex-center-start mt-4 flex-wrap gap-4">
              <input
                onChange={e => setMobile(e.target.value)}
                minLength={11}
                maxLength={11}
                onKeyPress={onlyTypeNumber}
                placeholder="شماره موبایل خود را وارد کنید."
                type="text"
                className="bk-input max-w-sm"
              />
              <button
                type="submit"
                className={'bk-button-green ' + (isPendingSendSms ? 'disable-action' : '')}
              >
                {isPendingSendSms ? (
                  <TheSpinner />
                ) : (
                  <span>
                    <FaSms size="24px" className="ml-2 inline-flex align-middle" />
                    تست ارسال پیامک
                  </span>
                )}
              </button>
            </form>

            <form onSubmit={handlerTestEmail} className="flex-center-start mt-4 flex-wrap gap-4">
              <input
                onChange={e => setEmail(e.target.value)}
                placeholder="ایمیل خود را وارد کنید."
                type="text"
                className="bk-input max-w-sm"
              />
              <button
                type="submit"
                className={'bk-button-red ' + (isPendingSendEmail ? 'disable-action' : '')}
              >
                {isPendingSendEmail ? (
                  <TheSpinner />
                ) : (
                  <span>
                    <MdEmail size="24px" className="ml-2 inline-flex align-middle" />
                    تست ارسال ایمیـل
                  </span>
                )}
              </button>
            </form>
          </div>
        </>
      )}
      <div className="my-4 w-full p-4">
        <hr className="panel-section-separator" />
      </div>
    </>
  )
}
