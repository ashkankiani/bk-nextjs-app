'use client'

import TheHeader from '@/components/front-end/theme1/layout/TheHeader'
import TheFooter from '@/components/front-end/theme1/layout/TheFooter'
import TheSpinner from '@/components/layout/TheSpinner'
import { useGetFaqs } from '@/hooks/user/useFaq'

export default function TheFaqsUi() {
  const { data: dataFaqs, isLoading: isLoadingFaqs } = useGetFaqs()

  return (
    <div className="bk-box md:w-8/12 lg:w-7/12">
      <TheHeader />
      <div className="bk-box-wrapper">
        <h1 className="bk-box-wrapper-title">سوالات متداول</h1>
        <p className="bk-box-wrapper-description">سریعتر پاسخ مشکلات خود را بیابید.</p>
        {isLoadingFaqs ? (
          <TheSpinner />
        ) : dataFaqs && dataFaqs.length > 0 ? (
          dataFaqs.map((item, index) => (
            <div
              key={index}
              className="mb-4 border-b border-black pb-4 last:border-b-0 dark:border-darkNavy3"
            >
              <p className="fa-sbold-18px mb-3">
                {index + 1}- {item.title}
              </p>
              <p className="fa-regular-16px">{item.content}</p>
            </div>
          ))
        ) : (
          <p className="fa-bold-16px text-center text-red-700">در حال حاضر سوالی طرح نشده است.</p>
        )}
      </div>
      <TheFooter />
    </div>
  )
}
