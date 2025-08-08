import {
  TypeBankName,
  TypeGender,
  TypeOrderMethod,
  TypePay,
  TypeReservationsStatus,
} from '@/types/typeConfig'
import {
  TypeApiConnection,
  TypeApiDiscount,
  TypeApiFaq,
  TypeApiOrder,
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
  userId?: string
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
  userId: string
}
export type TypeApiGetReservationsByUserIdRes = TypeApiReservation

export type TypeApiAddReservationsReq = {
  orderId: string
  serviceId: number
  providerId: number
  userId: string
  dateTimeStartEpoch?: number // bigint
  dateTimeEndEpoch?: number // bigint
  date: string
  time: string[]
}

export type TypeApiAddReservationsRes = {
  results: {
    serviceId: number
    providerId: number
    userId: string
    dateTimeStartEpoch: number
    dateTimeEndEpoch: number
    date: number
    time: string
    createEpoch: number
  }[]
  status: boolean
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
  type: 'OnlinePayment' | 'UnknownPayment'
  gateway: TypeBankName | 'COD'
  price: number
  userId: string
  orderId: string
}
export type TypeApiCreateAuthorityRes = {
  authority: string
  url: string
}
export type TypeApiVerifyPaymentReq = {
  authority: string
  trackingCode: string
  method: TypeOrderMethod
  price: number
  userId: string
}
export type TypeApiVerifyPaymentRes = {
  order: TypeApiOrder
  automaticConfirmation: boolean
  reservations: (TypeApiReservation & {
    service: {
      name: string
      descriptionAfterPurchase: string
    }
    provider: {
      user: {
        fullName: string
      }
    }
  })[]
}

/*<====================================>*/
// Order
/*<====================================>*/
export type TypeApiAddOrderReq = {
  userId: string
  // serviceId: number,
  // providerId: number,
  discountId: number | null
  price: number
  discountPrice: number
  totalPrice: number
}
export type TypeApiShowOrderReq = {
  id: number
}
export type TypeApiShowOrderRes = TypeApiOrder

export type TypeApiAddOrderRes = TypeApiOrder

export type TypeApiUpdateOrderReq = {
  trackingCode: string
}
export type TypeApiUpdateOrderRes = {
  Authority: string
  Status: TypePay
}

export type TypeApiGetOrderByAuthorityReq = {
  id: string
}

export type TypeApiGetOrderByAuthorityRes = TypeApiOrder

/*<====================================>*/
// Order
/*<====================================>*/
export type TypeApiGetFaqsRes = TypeApiFaq
