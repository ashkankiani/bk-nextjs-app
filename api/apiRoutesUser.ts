import {TypeApiRoutesClient} from "@/types/typeConfig";

export const ApiRoutesUser: TypeApiRoutesClient = {
    Setting: {
        GetSettings: '/user/setting/getSettings',
    },
    Service: {
        GetServices: '/user/service/getServices',
    },
    Provider: {
        GetProvidersForService: '/user/provider/getProvidersForService?',
    },
    Auth: {
        Login: '/user/auth/login',
        LoginOtp: '/user/auth/loginOtp',
        SendCodeOtp: '/user/auth/sendCodeOtp',
    },
}
