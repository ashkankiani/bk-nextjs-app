"use client"
import {ReactNode, useEffect} from "react";
import Script from "next/script";
import useHook from "@/hooks/controller/useHook";
import {useGetSettings} from "@/hooks/user/useSetting";
import {setSetting} from "@/store/slice/app";

export default function Theme1Layout({children}: { children: ReactNode }) {
    const {theme, dispatch} = useHook()
    const {data: dataSettings, isFetched: isFetchedSettings} = useGetSettings()

    useEffect(() => {
        if (isFetchedSettings) {
            dispatch(setSetting(dataSettings))
        }
    }, [isFetchedSettings])

    return (
        <>
            <div>
                <div className={" " + (theme === "light" ? 'bg-home-theme1 bg-cover bg-center ' : '')}>
                    <div className="container min-h-screen flex-center-center flex-col py-4">
                        {children}
                    </div>
                </div>
                {
                    dataSettings && dataSettings[0]?.footerCode && dataSettings[0]?.footerCode.length > 0 &&
                    <Script id="my-script1">{dataSettings[0]?.footerCode}</Script>
                }
            </div>
        </>
    )
}