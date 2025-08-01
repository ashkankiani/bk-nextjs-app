'use client'
import Link from 'next/link'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { AiOutlineSave } from 'react-icons/ai'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import TheSpinner from '@/components/layout/TheSpinner'
import FormErrorMessage from '@/components/back-end/section/FormErrorMessage'
import * as XLSX from 'xlsx'
import { bkToast } from '@/libs/utility'
import { LuImport } from 'react-icons/lu'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { useRouter } from 'next/router'
import { useImportUsers } from '@/hooks/admin/useUser'
import { TypeApiImportUsersReq } from '@/types/typeApiAdmin'

export default function TheImportUsersUi() {
  const router = useRouter()

  const { mutateAsync: mutateAsyncImportUsers, isPending: isPendingImportUsers } = useImportUsers()

  const [loading, setLoading] = useState<boolean>(false)
  const [showDataTable, setShowDataTable] = useState<boolean>(false)
  const [data, setData] = useState<TypeApiImportUsersReq[]>([])
  const [dataError, setDataError] = useState<number>(0)

  type TypeFormTheAddExcelUsersUi = {
    file: File[]
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeFormTheAddExcelUsersUi>({
    criteriaMode: 'all',
  })

  const onSubmit = async (data: TypeFormTheAddExcelUsersUi) => {
    const file = data.file[0]

    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      bkToast(
        'error',
        'فرمت فایل ورودی صحیح نیست. فرمت فقط باید اکسل باشد. لطفا از فایل پیشفرض استفاده نمایید.'
      )
      return
    }

    setLoading(true)
    setShowDataTable(false)
    const reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = e => {
      setLoading(false)

      const data = e.target!.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const parsedData = XLSX.utils.sheet_to_json(sheet) as TypeApiImportUsersReq[]

      const keys = ['codeMeli', 'fullName', 'mobile', 'email']

      const allObjectsHaveKeys = parsedData.every(obj =>
        keys.every(key => Object.prototype.hasOwnProperty.call(obj, key))
      )

      if (!allObjectsHaveKeys) {
        setData([])
        setShowDataTable(false)
        bkToast('error', 'فایل اکسل دارای مشکل است. لطفا فایل پیشفرض استفاده نمایید.')
        return
      }

      setData(parsedData)
      let countError = 0
      for (let i = 0; i < parsedData.length; i++) {
        if (
          // parsedData[i]['codeMeli'].toString().length !== 10 ||
          parsedData[i]['codeMeli'].length !== 10 ||
          parsedData[i]['fullName'].length < 4 ||
          parsedData[i]['mobile'].length !== 11
        ) {
          countError = countError + 1
        }
      }

      if (countError > 0) {
        bkToast('error', countError + ' خطا بخاطر مقادیر غیر منطقی پیدا شد.')
      }

      setShowDataTable(true)
      setDataError(countError)
    }
  }

  const handlerImportUsers = async () => {
    await mutateAsyncImportUsers(data)
      .then(res => {
        if (res.CountError > 0) bkToast('error', res.CountError + ' کاربر اضافه نشدند.')
        if (res.CountSuccess > 0) bkToast('success', res.CountSuccess + ' کاربر اضافه شدند.')
        router.push('/admin/users')
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  return (
    <>
      <HeaderPage
        title="درون ریزی کاربر جدید"
        description="کاربر جدید را از طریق اکسل اضافه نمایید."
      >
        <Link href="/admin/users" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="ml-2 inline-flex align-middle" />
          <span>لیست کاربران</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-center-start flex-wrap">
            <div className="panel-col-100">
              <h2 className="fa-sbold-20px mb-4 text-red-500">
                ابتدا از دیتابیس خود حتما یک بک آپ بگیرید.
              </h2>
              <h2 className="fa-sbold-20px mb-4">
                اکسل
                <a
                  className="px-1 text-green-500"
                  target="_blank"
                  href="/fileXLSX.xlsx"
                  download={true}
                >
                  پیش فرض
                </a>
                را دانلود نمایید. سپس اطلاعات کاربران را به ترتیب زیر در یک ستون وارد کنید. ترتیب
                زیر بسیار مهم است.
              </h2>
              <ol className="fa-regular-20px list-inside list-decimal">
                <li className="p-2">ستون یک: کدملی (10 رقمی)</li>
                <li className="p-2">ستون دو: نام و نام خانوادگی</li>
                <li className="p-2">ستون سه: موبایل (11 رقمی با فرمت با صفر مثال 09120001234)</li>
                <li className="p-2">
                  ستون چهار: ایمیل (بستگی به ضروری بودن یا نبودن در تنظیمات سیستم)
                </li>
              </ol>
            </div>
            <div className="panel-col-25 mx-auto">
              <label>
                فایل اکسل<span>*</span>
              </label>
              <input
                {...register('file', {
                  required: {
                    value: true,
                    message: 'نام و نام خانوادگی ضروری است.',
                  },
                })}
                type="file"
                className="bk-input"
              />
              <FormErrorMessage errors={errors} name="file" />
            </div>
            <div className="panel-col-100">
              <button
                className={'panel-form-submit ' + (loading ? 'disable-action' : '')}
                type="submit"
              >
                {loading ? (
                  <TheSpinner />
                ) : (
                  <span>
                    <LuImport size="24px" className="ml-2 inline-flex align-middle" />
                    درون ریزی کاربر
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      {showDataTable && (
        <div className="mt-10">
          <h2 className="fa-sbold-18px text-center">لیست دیتاهای شما به شرح زیر است:</h2>
          <div className="bk-table">
            <table>
              <thead>
                <tr>
                  <th className="w-[50px]">ردیف</th>
                  <th>کدملی</th>
                  <th>نام و نام خانوادگی</th>
                  <th>موبایل</th>
                  <th>ایمیل</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className={item.codeMeli.toString().length !== 10 ? 'bg-red-500' : ''}>
                        {item.codeMeli}
                      </td>
                      <td className={item.fullName.length < 5 ? 'bg-red-500' : ''}>
                        {item.fullName}
                      </td>
                      <td className={item.mobile.length !== 11 ? 'bg-red-500' : ''}>
                        {item.mobile}
                      </td>
                      <td>{item.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>کاربری برای نمایش وجود ندارد.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showDataTable && dataError === 0 && (
        <div className="panel-col-100 mt-10">
          <button
            onClick={() => handlerImportUsers()}
            className={'panel-form-submit ' + (isPendingImportUsers ? 'disable-action' : '')}
          >
            {isPendingImportUsers ? (
              <TheSpinner />
            ) : (
              <span>
                <AiOutlineSave size="24px" className="ml-2 inline-flex align-middle" />
                تایید درون ریزی
              </span>
            )}
          </button>
        </div>
      )}
    </>
  )
}
