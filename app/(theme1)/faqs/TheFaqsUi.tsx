import {useEffect, useState} from "react";
import {bkToast} from "@/libs/utility";
import TheHeader from "@/components/front-end/theme1/layout/TheHeader";
import TheFooter from "@/components/front-end/theme1/layout/TheFooter";
import {hookListFaqs} from "@/hooks/user/hookFaq";
import TheSpinner from "@/components/layout/TheSpinner";

export default function TheFaqsUi() {

    const [loading, setLoading] = useState(false)
    const [faqs, setFaqs] = useState([])

    const handlerListFaqs = async () => {
        setLoading(false)
        await hookListFaqs((response, message) => {
            setLoading(true)
            if (response) {
                setFaqs(message)
            } else {
                bkToast('error', message)
            }
        })
    }

    useEffect(() => {
        handlerListFaqs()
    }, [])

    return (
        <div className="bk-box md:w-8/12 lg:w-7/12">
            <TheHeader/>
            <div className="bk-box-wrapper">
                <h1 className="bk-box-wrapper-title">سوالات متداول</h1>
                <p className="bk-box-wrapper-description">سریعتر پاسخ مشکلات خود را بیابید.</p>
                {
                    loading ?
                        faqs.length > 0 ?
                            faqs.map((item, index) =>
                                <div key={index}
                                     className="border-b last:border-b-0 border-black dark:border-darkNavy3 mb-4 pb-4">
                                    <p className="mb-3 fa-sbold-18px">{index + 1}- {item.title}</p>
                                    <p className="fa-regular-16px">{item.content}</p>
                                </div>
                            )
                            :
                            <p className="fa-bold-16px text-red-700 text-center">در حال حاضر سوالی طرح نشده است.</p>
                        :
                        <TheSpinner/>
                }
            </div>
            <TheFooter/>
        </div>
    )
}