import {TypeApiRoutesUser} from "@/types/typeConfig";

export const ApiRoutesUser: TypeApiRoutesUser = {
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
        SignIn: '/user/auth/signIn',
        SignInOtp: '/user/auth/signInOtp',
        SendCodeOtp: '/user/auth/sendCodeOtp',
        SignUp: '/user/auth/signUp',
        ResetPassword: '/user/auth/resetPassword',
        UpdateUser: '/user/auth/updateUser',
    },
}
