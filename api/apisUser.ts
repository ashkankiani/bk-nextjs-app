import { getRequest, postRequest, putRequest } from '@/api/apiRequest'
import {
  TypeApiSignInRes,
  TypeApiSendCodeOtpRes,
  TypeApiSignUpRes,
  TypeApiSignUpReq,
  TypeApiResetPasswordReq,
  TypeApiResetPasswordRes,
  TypeApiSignInReq,
  TypeApiSignInOtpReq,
  TypeApiSendCodeOtpReq,
  TypeApiUpdateUserRes,
  TypeApiUpdateUserReq,
  TypeApiGetServicesRes,
  TypeApiGetProvidersByServiceIdReq,
  TypeApiGetProvidersByServiceIdRes,
  TypeApiAvailableTimesReq,
  TypeApiAvailableTimesRes,
  TypeApiGetReservationsByUserIdRes,
  TypeApiGetReservationsByUserIdReq,
  TypeApiGetConnectionsRes,
  TypeApiGetGatewaysRes,
  TypeApiCheckDiscountReq,
  TypeApiCheckDiscountRes,
  TypeApiAddReservationsReq,
  TypeApiAddReservationsRes,
  TypeApiCreateAuthorityReq,
  TypeApiCreateAuthorityRes,
  TypeApiVerifyPaymentReq,
  TypeApiVerifyPaymentRes,
  TypeApiAddOrderReq,
  TypeApiAddOrderRes,
  TypeApiUpdateOrderReq,
  TypeApiUpdateOrderRes,
  TypeApiGetOrderByBankTransactionCodeReq,
  TypeApiGetOrderByBankTransactionCodeRes,
  TypeApiShowOrderReq,
  TypeApiShowOrderRes,
} from '@/types/typeApiUser'
import { ApiRoutesUser } from '@/api/apiRoutesUser'
import { TypeApiSetting } from '@/types/typeApiEntity'

/*<====================================>*/
// Setting
/*<====================================>*/
export const GetSettings = () => getRequest<TypeApiSetting[]>(ApiRoutesUser.Setting.GetSettings)

/*<====================================>*/
// Service
/*<====================================>*/
export const GetServices = () =>
  getRequest<TypeApiGetServicesRes[]>(ApiRoutesUser.Service.GetServices)

/*<====================================>*/
// Provider
/*<====================================>*/
export const GetProvidersByServiceId = (params: TypeApiGetProvidersByServiceIdReq) =>
  getRequest<TypeApiGetProvidersByServiceIdRes[]>(
    ApiRoutesUser.Provider.GetProvidersByServiceId,
    params
  )

/*<====================================>*/
// Auth
/*<====================================>*/
export const SignIn = (params: TypeApiSignInReq) =>
  postRequest<TypeApiSignInRes>(ApiRoutesUser.Auth.SignIn, params)
export const SignInOtp = (params: TypeApiSignInOtpReq) =>
  postRequest<TypeApiSignInRes>(ApiRoutesUser.Auth.SignInOtp, params)
export const SendCodeOtp = (params: TypeApiSendCodeOtpReq) =>
  postRequest<TypeApiSendCodeOtpRes>(ApiRoutesUser.Auth.SendCodeOtp, params)
export const SignUp = (params: TypeApiSignUpReq) =>
  postRequest<TypeApiSignUpRes>(ApiRoutesUser.Auth.SignUp, params)
export const ResetPassword = (params: TypeApiResetPasswordReq) =>
  postRequest<TypeApiResetPasswordRes>(ApiRoutesUser.Auth.ResetPassword, params)
export const UpdateUser = (params: TypeApiUpdateUserReq) =>
  postRequest<TypeApiUpdateUserRes>(ApiRoutesUser.Auth.UpdateUser, params)

/*<====================================>*/
// Reservation
/*<====================================>*/
export const AvailableTimes = (params: TypeApiAvailableTimesReq) =>
  getRequest<TypeApiAvailableTimesRes[]>(ApiRoutesUser.Reservation.AvailableTimes, params)
export const GetReservationsByUserId = (params: TypeApiGetReservationsByUserIdReq) =>
  getRequest<TypeApiGetReservationsByUserIdRes[]>(
    ApiRoutesUser.Reservation.GetReservationsByUserId,
    params
  )
export const AddReservations = (params: TypeApiAddReservationsReq[]) =>
  postRequest<TypeApiAddReservationsRes>(ApiRoutesUser.Reservation.AddReservations, params)

/*<====================================>*/
// Holiday
/*<====================================>*/
// export const GetHolidays = () => getRequest<TypeApiGetHolidaysRes>(ApiRoutesUser.Holiday.GetHolidays)

/*<====================================>*/
// Connection
/*<====================================>*/
export const GetConnections = () =>
  getRequest<TypeApiGetConnectionsRes>(ApiRoutesUser.Connection.GetConnections)

/*<====================================>*/
// Discount
/*<====================================>*/
export const CheckDiscount = (params: TypeApiCheckDiscountReq) =>
  getRequest<TypeApiCheckDiscountRes>(ApiRoutesUser.Discount.CheckDiscount, params)

/*<====================================>*/
// Gateway
/*<====================================>*/
export const GetGateways = () =>
  getRequest<TypeApiGetGatewaysRes[]>(ApiRoutesUser.Gateway.GetGateways)
export const CreateAuthority = (params: TypeApiCreateAuthorityReq) =>
  postRequest<TypeApiCreateAuthorityRes>(ApiRoutesUser.Gateway.CreateAuthority, params)
export const VerifyPayment = (params: TypeApiVerifyPaymentReq) =>
  postRequest<TypeApiVerifyPaymentRes>(ApiRoutesUser.Gateway.VerifyPayment, params)

/*<====================================>*/
// Order
/*<====================================>*/
export const AddOrder = (params: TypeApiAddOrderReq) =>
  postRequest<TypeApiAddOrderRes>(ApiRoutesUser.Order.AddOrder, params)
export const ShowOrder = (params: TypeApiShowOrderReq) =>
  getRequest<TypeApiShowOrderRes>(ApiRoutesUser.Order.ShowOrder, params)
export const UpdateOrder = (params: TypeApiUpdateOrderReq) =>
  putRequest<TypeApiUpdateOrderRes>(ApiRoutesUser.Order.UpdateOrder, params)
export const GetOrderByBankTransactionCode = (params: TypeApiGetOrderByBankTransactionCodeReq) =>
  getRequest<TypeApiGetOrderByBankTransactionCodeRes>(
    ApiRoutesUser.Order.GetOrderByBankTransactionCode,
    params
  )
