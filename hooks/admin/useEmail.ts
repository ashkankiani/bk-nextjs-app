import {useMutation} from '@tanstack/react-query'
import {SendEmail} from "@/api/apisAdmin";
import {TypeApiSendEmailReq} from "@/types/typeApi";

function useSendEmail(Optional?: object) {
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiSendEmailReq) => SendEmail(data),
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

export {
    useSendEmail,
}
