import {getRequest, postRequest} from '@/api/apiRequest'
import {
    TypeApiSignInRes,
    TypeApiSendCodeOtpRes,
    TypeApiGetProvidersForServiceRes,
    TypeApiSignUpRes,
    TypeApiSignUpReq,
    TypeApiResetPasswordReq,
    TypeApiResetPasswordRes,
    TypeApiSignInReq,
    TypeApiSignInOtpReq,
    TypeApiSendCodeOtpReq,
    TypeApiGetProvidersForServiceReq, TypeApiUpdateUserRes, TypeApiUpdateUserReq
} from "@/types/typeApiUser";
import {ApiRoutesUser} from '@/api/apiRoutesUser'
import {TypeApiService, TypeApiSetting} from "@/types/typeApiEntity";


/*<====================================>*/
// Setting
/*<====================================>*/
export const GetSettings = () => getRequest<TypeApiSetting[]>(ApiRoutesUser.Setting.GetSettings)

/*<====================================>*/
// Service
/*<====================================>*/
export const GetServices = () => getRequest<TypeApiService[]>(ApiRoutesUser.Service.GetServices)

/*<====================================>*/
// Provider
/*<====================================>*/
export const GetProvidersForService = (params: TypeApiGetProvidersForServiceReq) => getRequest<TypeApiGetProvidersForServiceRes[]>(ApiRoutesUser.Provider.GetProvidersForService , params)


/*<====================================>*/
// Auth
/*<====================================>*/
export const SignIn = (params: TypeApiSignInReq) => postRequest<TypeApiSignInRes>(ApiRoutesUser.Auth.SignIn , params)
export const SignInOtp = (params: TypeApiSignInOtpReq) => postRequest<TypeApiSignInRes>(ApiRoutesUser.Auth.SignInOtp , params)
export const SendCodeOtp = (params: TypeApiSendCodeOtpReq) => postRequest<TypeApiSendCodeOtpRes>(ApiRoutesUser.Auth.SendCodeOtp , params)
export const SignUp = (params: TypeApiSignUpReq) => postRequest<TypeApiSignUpRes>(ApiRoutesUser.Auth.SignUp , params)
export const ResetPassword = (params: TypeApiResetPasswordReq) => postRequest<TypeApiResetPasswordRes>(ApiRoutesUser.Auth.ResetPassword , params)
export const UpdateUser = (params: TypeApiUpdateUserReq) => postRequest<TypeApiUpdateUserRes>(ApiRoutesUser.Auth.UpdateUser , params)

