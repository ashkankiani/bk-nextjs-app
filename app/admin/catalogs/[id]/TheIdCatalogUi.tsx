'use client'
import Link from 'next/link'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { bkToast, textPermissionType } from '@/libs/utility'
import { useForm } from 'react-hook-form'
import TheSpinner from '@/components/layout/TheSpinner'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { AiOutlineSave } from 'react-icons/ai'
import { useParams } from 'next/navigation'
import useHook from '@/hooks/controller/useHook'
import { useShowPermission } from '@/hooks/admin/usePermission'
import { useUpdatePermission } from '@/hooks/admin/usePermission'
import { TypeApiUpdatePermissionReq } from '@/types/typeApiAdmin'
import { useEffect } from 'react'
import { TypePermissionKeys } from '@/types/typeConfig'

export default function TheIdCatalogUi() {
  const params = useParams()
  const id = Number(params.id)

  const { router } = useHook()

  const {
    data: dataPermission,
    isLoading: isLoadingPermission,
    isFetched: isFetchedPermission,
  } = useShowPermission(id)
  const { mutateAsync: mutateAsyncUpdatePermission, isPending: isPendingUpdatePermission } =
    useUpdatePermission()

  const {
    register,
    handleSubmit,
    setValue,
    // formState: {errors},
  } = useForm<TypeApiUpdatePermissionReq>({
    criteriaMode: 'all',
  })

  const onSubmit = async (data: TypeApiUpdatePermissionReq) => {
    await mutateAsyncUpdatePermission(data)
      .then(res => {
        bkToast('success', res.Message)
        router.push('/admin/catalogs')
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  useEffect(() => {
    if (isFetchedPermission && dataPermission) {
      setValue('id', dataPermission.id)
      setValue('catalogId', dataPermission.catalogId)
    }
  }, [isFetchedPermission])

  return (
    <>
      <HeaderPage title="ویرایش مجوزها" description="مجوزهای سطح دسترسی خود را ویرایش کنید.">
        <Link href="/admin/catalogs" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="ml-2 inline-flex align-middle" />
          <span>لیست سطوح</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        {isLoadingPermission ? (
          <TheSpinner />
        ) : (
          <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-center-start mb-4 flex-wrap gap-4" dir="ltr">
              {dataPermission &&
                (Object.entries(dataPermission) as [TypePermissionKeys, boolean][]).map(
                  ([key, value], index) => {
                    if (key !== 'id' && key !== 'catalogId') {
                      return (
                        <div
                          key={key + index}
                          className="fa-regular-18px rounded-md border border-neutral-400 bg-white p-2 dark:border-darkNavy3 dark:bg-darkNavy2 dark:text-white"
                        >
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              {...register(key, {})}
                              type="checkbox"
                              className="bk-checkbox"
                              defaultChecked={value}
                            />
                            <span className="flex-start-start-column gap-1">
                              <span className="fa-sbold-14px truncate">
                                {textPermissionType(key)}
                              </span>
                              <span className="en-regular-12px truncate">{key}</span>
                            </span>
                          </label>
                        </div>
                      )
                    }
                    return null
                  }
                )}
            </div>

            <div className="panel-col-100">
              <button
                className={
                  'panel-form-submit ' + (isPendingUpdatePermission ? 'disable-action' : '')
                }
                type="submit"
              >
                {isPendingUpdatePermission ? (
                  <TheSpinner />
                ) : (
                  <span>
                    <AiOutlineSave size="24px" className="ml-2 inline-flex align-middle" />
                    ویرایش مجوزها
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
