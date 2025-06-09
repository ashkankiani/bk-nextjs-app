import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {useRouter} from "next/router";
import {bkToast} from "@/libs/utility";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import TheSpinner from "@/components/layout/TheSpinner";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {hookGetPermissionWhere, hookUpdatePermission} from "@/hooks/admin/hookPermissions";
import {AiOutlineSave} from "react-icons/ai";

export default function EditPermissions({id}) {
  const router = useRouter()

  const [loadingPermissions, setLoadingPermissions] = useState(false)

  const [loading, setLoading] = useState(false)
  const [dataPermissions, setDataPermissions] = useState([])

  const {
    register,
    handleSubmit,
    // formState: {errors},
  } = useForm({
    criteriaMode: 'all',
  })


  const onSubmit = data => {
    handlerUpdatePermission(data)
  }


  const handlerUpdatePermission = async data => {
    setLoading(true)
    await hookUpdatePermission(data, id, (response, message) => {
      setLoading(false)
      if (response) {
        bkToast('success', message)
        router.push('/admin/catalogs')
      } else {
        bkToast('error', message)
      }
    })
  }


  const handlerGetPermissionWhere = async () => {
    setLoadingPermissions(false)
    let params = {
      condition: {
        where: {
          catalogId: parseInt(id),
        },
      }
    }
    await hookGetPermissionWhere(params, async (response, message) => {
      if (response) {
        setLoadingPermissions(true)
        setDataPermissions(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerGetPermissionWhere()
  }, [])

  return (
    <>
      <HeadPage title="ویرایش مجوزها"/>
      <HeaderPage title="ویرایش مجوزها" description="مجوزهای سطح دسترسی خود را ویرایش کنید.">
        <Link href="/admin/catalogs" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
          <span>لیست سطوح</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        {
          loadingPermissions ?
            <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex-center-start gap-4 flex-wrap mb-4" dir="ltr">
                {dataPermissions.map((item, index) =>
                  Object.entries(item).map(([key, value]) => {
                    if (key !== 'id' && key !== 'catalogId') {
                      return (
                        <div key={key + index}
                             className="rounded-md  p-2 fa-regular-18px bg-white border border-neutral-400 dark:border-darkNavy3 dark:bg-darkNavy2 dark:text-white">
                          <label className="flex items-center gap-2 cursor-pointer ">
                            <input
                              {...register(key, {})}
                              type="checkbox"
                              className="bk-checkbox"
                              defaultChecked={value}
                            />
                            <span className="truncate" title={key}>
                          {key}
                        </span>
                          </label>
                        </div>
                      )
                    }
                    return null
                  }),
                )}
              </div>

              <div className="panel-col-100">
                <button
                  className={
                    'panel-form-submit ' +
                    (loading ? 'disable-action' : '')
                  }
                  type="submit">
                  {loading ? (
                    <TheSpinner/>
                  ) : (
                    <span><AiOutlineSave size="24px" className="inline-flex align-middle ml-2"/>ویرایش مجوزها</span>
                  )}
                </button>
              </div>
            </form>

            :
            <TheSpinner/>
        }
      </div>
    </>
  )
}

export const getServerSideProps = ({query}) => {
  const id = query.id
  return {props: {id}}
}