import { TypeBankName, TypeGender, TypeReservationsStatus } from '@/types/typeConfig'
import {
  TypeApiConnection, TypeApiDiscount,
  TypeApiPermission,
  TypeApiProvider,
  TypeApiReservation,
  TypeApiService,
  TypeApiUser,
} from '@/types/typeApiEntity'
import { TypeTimeSlotGenerator } from '@/libs/utility'

/*<====================================>*/
// Auth
/*<====================================>*/
export interface TypeApiSignInReq {
  codeMeli: string
  password: string
}
export interface TypeApiSignInOtpReq {
  mobile: string
}

export interface TypeApiSignInRes {
  id: number
  catalogId: number
  codeMeli: string
  fullName: string
  mobile: string
  email: string | null
  lock: boolean
  providerIds?: number[]
  permissions: TypeApiPermission
}

export interface TypeApiSendCodeOtpReq {
  mobile: string
}

export interface TypeApiSendCodeOtpRes {
  Message: string
}

export interface TypeApiSignUpReq {
  codeMeli: string
  fullName: string
  email: string
  mobile: string
  password: string
}
export interface TypeApiSignUpRes {
  Message: string
}
export interface TypeApiResetPasswordReq {
  mobile: string
  password: string
}
export interface TypeApiResetPasswordRes {
  Message: string
}
export interface TypeApiUpdateUserReq {
  codeMeli: string
  fullName: string
  email?: string
  mobile: string
  password?: string
  gender: TypeGender
}

export interface TypeApiUpdateUserRes {
  Message: string
}

/*<====================================>*/
// Service
/*<====================================>*/
export type TypeApiGetServicesRes = TypeApiService

/*<====================================>*/
// Provider
/*<====================================>*/

export type TypeApiGetProvidersByServiceIdReq = {
  serviceId: number
}
export type TypeApiGetProvidersByServiceIdRes = TypeApiProvider & {
  service: TypeApiService
  user: TypeApiUser
}

// export type TypeApiGetProvidersForServiceRes = TypeApiProvider & {
//     service: Partial<TypeApiService>;
//     user: Partial<TypeApiUser>;
// };
//

/*<====================================>*/
// Reservation
/*<====================================>*/
export type TypeApiAvailableTimesReq = {
  userId?: number
  serviceId: number
  providerId: number
  startDate: string
  endDate: string
  status: TypeReservationsStatus[]
}

export type TypeApiAvailableTimesRes = {
  date: string
  dayIsHoliday: boolean
  title: string
  timeSheet: TypeTimeSlotGenerator
  is: boolean
}

export type TypeApiGetReservationsByUserIdReq = {
  userId: number
}
export type TypeApiGetReservationsByUserIdRes = TypeApiReservation


export type TypeApiAddDraftReservationsReq = {
  serviceId: number
  providerId: number
  userId: number
  // price: number
  date: string
  time: string[]
}

export type TypeApiAddDraftReservationsRes = {
  results:{
    serviceId: number
    providerId: number
    userId: number
    dateTimeStartEpoch: number
    dateTimeEndEpoch: number
    date: number
    time: string
    createEpoch: number
  }[]
  userId: number
  successes: number
  errors: number
  message: string
}
/*<====================================>*/
// Holiday
/*<====================================>*/
// export type TypeApiGetHolidaysRes = TypeApiHoliday[]

/*<====================================>*/
// Connection
/*<====================================>*/
export type TypeApiGetConnectionsRes = TypeApiConnection[]


/*<====================================>*/
// Discount
/*<====================================>*/
export type TypeApiCheckDiscountReq = {
  code: string
}

export type TypeApiCheckDiscountRes = TypeApiDiscount


/*<====================================>*/
// Gateway
/*<====================================>*/
export type TypeApiGetGatewaysRes = {
  key: TypeBankName
  title: string
  type: 'OnlinePayment'
}
export type TypeApiCreateAuthorityReq = {
  gateway: TypeBankName
  price: number
  userId: number
}
export type TypeApiCreateAuthorityRes = {
  authority: string
  url: string
}
export type TypeApiVerifyPaymentReq = {
  authority: string
  price: number
}
export type TypeApiVerifyPaymentRes = {
  authority: string
  url: string
}