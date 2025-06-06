import {useMutation} from '@tanstack/react-query'
import {Login, LoginOtp, SendCodeOtp} from "@/api/apisClient";


function useLogin(Optional?: object) {
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: { codeMeli: string, password: string }) => Login(data),
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

function useLoginOtp(Optional?: object) {
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: { mobile: string }) => LoginOtp(data),
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

function useSendCodeOtp(Optional?: object) {
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: { mobile: string }) => SendCodeOtp(data),
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}


export {useLogin, useLoginOtp, useSendCodeOtp}
