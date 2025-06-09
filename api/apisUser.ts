import {getRequest, postRequest} from '@/api/apiRequest'
import {ApiRoutesUser} from '@/api/apiRoutesUser'
import {
    TypeApiSettings,
    TypeApiServices,
    TypeApiSignInRes,
    TypeApiSendCodeOtpRes,
    TypeApiGetProvidersForServiceRes,
    TypeApiSignUpRes,
    TypeApiSignUpReq,
    TypeApiResetPasswordReq,
    TypeApiResetPasswordRes, TypeApiUsers, TypeApiUpdateUserReq
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
export const SignIn = (params: { codeMeli: string, password: string }) => postRequest<TypeApiSignInRes>(ApiRoutesUser.Auth.SignIn , params)
export const SignInOtp = (params: { mobile: string }) => postRequest<TypeApiSignInRes>(ApiRoutesUser.Auth.SignInOtp , params)
export const SendCodeOtp = (params: { mobile: string }) => postRequest<TypeApiSendCodeOtpRes>(ApiRoutesUser.Auth.SendCodeOtp , params)
export const SignUp = (params: TypeApiSignUpReq) => postRequest<TypeApiSignUpRes>(ApiRoutesUser.Auth.SignUp , params)
export const ResetPassword = (params: TypeApiResetPasswordReq) => postRequest<TypeApiResetPasswordRes>(ApiRoutesUser.Auth.ResetPassword , params)
export const UpdateUser = (params: TypeApiUpdateUserReq) => postRequest<TypeApiUsers>(ApiRoutesUser.Auth.UpdateUser , params)

