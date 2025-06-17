import {useMutation} from '@tanstack/react-query'
import {SendSms} from "@/api/apisAdmin";
import {TypeApiSendSmsReq} from "@/types/typeApiAdmin";

function useSendSms(Optional?: object) {
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiSendSmsReq) => SendSms(data),
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

export {
    useSendSms,
}
