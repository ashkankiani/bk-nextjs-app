import {getRequest, postRequest} from '@/api/apiRequest'
import {ApiRoutesUser} from '@/api/apiRoutesUser'
import {
    TypeApiSettings,
    TypeApiServices,
    TypeApiLoginRes,
    TypeApiSendCodeOtpRes,
    TypeApiGetProvidersForServiceRes
} from "@/types/typeApi";


/*<====================================>*/
// Setting
/*<====================================>*/
export const GetSettings = () => getRequest<TypeApiSettings[]>(ApiRoutesUser.Setting.GetSettings)

/*<====================================>*/
// Service
/*<====================================>*/
export const GetServices = () => getRequest<TypeApiServices[]>(ApiRoutesUser.Service.GetServices)

/*<====================================>*/
// Provider
/*<====================================>*/
export const GetProvidersForService = (params: { serviceId: number }) => getRequest<TypeApiGetProvidersForServiceRes[]>(ApiRoutesUser.Provider.GetProvidersForService , params)


/*<====================================>*/
// Auth
/*<====================================>*/
export const Login = (params: { codeMeli: string, password: string }) => postRequest<TypeApiLoginRes>(ApiRoutesUser.Auth.Login , params)
export const LoginOtp = (params: { mobile: string }) => postRequest<TypeApiLoginRes>(ApiRoutesUser.Auth.LoginOtp , params)
export const SendCodeOtp = (params: { mobile: string }) => postRequest<TypeApiSendCodeOtpRes>(ApiRoutesUser.Auth.SendCodeOtp , params)
