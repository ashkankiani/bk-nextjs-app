"use client"
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {hookDeleteSession} from "@/hooks/user/hookSession";
import {reducerUserReset} from "@/store/slice/user";
import {deleteCookie} from "cookies-next";
import {useEffect} from "react";

export default function TheSignOutUi() {

    const dispatch = useDispatch()
    const router = useRouter()

    const handlerDeleteSession = async () => {
        await hookDeleteSession()
        await handlerLogout()
    }

    const handlerLogout = () => {
        dispatch(reducerUserReset())
        deleteCookie("bk-session")
        router.push("/")
    }

    useEffect(() => {
        handlerDeleteSession()
    }, []);

    return('در حال خروج...')
}