import HeadPage from '@/components/layout/HeadPage'
import TheHeader from '@/components/front-end/theme1/layout/TheHeader'
import TheFooter from '@/components/front-end/theme1/layout/TheFooter'
import useHook from '@/hooks/controller/useHook'

export default function TheContactUi() {
  const { setting } = useHook()

  return (
    <>
      <HeadPage title="تماس با ما" />
      <div className="bk-box md:w-8/12 lg:w-7/12">
        <TheHeader />
        <div className="bk-box-wrapper">
          <h1 className="bk-box-wrapper-title">تماس با ما</h1>
          <p className="bk-box-wrapper-description">همیشه آنلاین و در دسترس هستیم</p>

          <div className="my-4 text-center">
            <p className="fa-sbold-18px mb-3">{setting.address}</p>
            <p className="fa-sbold-18px mb-3">{setting.phone}</p>
            <a href={setting.url} target="_blank" className="fa-sbold-18px mb-3">
              {setting.url}
            </a>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  )
}
