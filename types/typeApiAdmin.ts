import {
  TypeDiscountsType,
  TypeGender,
  TypePaymentType,
  TypeReservationsStatus,
  TypeStatusReserve,
} from '@/types/typeConfig'
import {
  TypeApiCatalog,
  TypeApiConnection,
  TypeApiDiscount,
  TypeApiFaq,
  TypeApiHoliday,
  TypeApiOrder,
  TypeApiPayment,
  TypeApiPermission,
  TypeApiProvider,
  TypeApiReservation,
  TypeApiService,
  TypeApiSetting,
  TypeApiTimeSheet,
  TypeApiTransaction,
  TypeApiUser,
} from '@/types/typeApiEntity'
import { DateObject } from 'react-multi-date-picker'
import {TypeTimeSlotGenerator} from "@/libs/utility";

export interface TypeCatalogs {
  id: number
  title: string

  Users?: TypeApiUser[]
  Permissions?: Permissions[]
}

export interface TypeSessions {
  id: number
  sessionToken: string
  userId: string

  expires: bigint // چون در پرایسما BigInt است، اینجا از bigint استفاده می‌کنیم
}

export interface TypeOtpSms {
  id: number
  mobile: string
  expires: bigint // چون BigInt هستیم از bigint استفاده می‌کنیم
  createdAt: Date
  updatedAt: Date
}

/*<====================================>*/
// Faq
/*<====================================>*/
export interface TypeApiAddFaqReq {
  title: string
  content: string
}

export interface TypeApiAddFaqRes {
  Message: string
}

export interface TypeApiDeleteFaqReq {
  id: number
}

export interface TypeApiDeleteFaqRes {
  Message: string
}

export type TypeApiGetFaqsRes = TypeApiFaq[]

export type TypeApiShowFaqReq = {
  id: number
}
export type TypeApiShowFaqRes = TypeApiFaq

export type TypeApiUpdateFaqReq = {
  id: number
  title: string
  content: string
}

export interface TypeApiUpdateFaqRes {
  Message: string
}

/*<====================================>*/
// Holiday
/*<====================================>*/

export interface TypeApiAddHolidayReq {
  date: string
  title: string
}

export interface TypeApiAddHolidayRes {
  Message: string
}

export interface TypeApiDeleteHolidayReq {
  id: number
}

export interface TypeApiDeleteHolidayRes {
  Message: string
}

export type TypeApiGetHolidaysRes = TypeApiHoliday[]

export type TypeApiShowHolidayReq = {
  id: number
}
export type TypeApiShowHolidayRes = TypeApiHoliday

export type TypeApiUpdateHolidayReq = {
  id: number
  date: string
  title: string
}

export interface TypeApiUpdateHolidayRes {
  Message: string
}

/*<====================================>*/
// Discount
/*<====================================>*/

export interface TypeApiAddDiscountReq {
  title: string
  code: string
  startDate?: string | null
  endDate?: string | null
  type: TypeDiscountsType
  amount: number
}

export interface TypeApiAddDiscountRes {
  Message: string
}

export interface TypeApiDeleteDiscountReq {
  id: number
}

export interface TypeApiDeleteDiscountRes {
  Message: string
}

export type TypeApiGetDiscountsRes = TypeApiDiscount

export type TypeApiShowDiscountReq = {
  id: number
}
export type TypeApiShowDiscountRes = TypeApiDiscount

export type TypeApiUpdateDiscountReq = {
  id: number
  title: string
  code: string
  startDate?: string | null
  endDate?: string | null
  type: TypeDiscountsType
  amount: number
}

export interface TypeApiUpdateDiscountRes {
  Message: string
}

/*<====================================>*/
// Catalog
/*<====================================>*/
export interface TypeApiAddCatalogReq {
  title: string
}

export interface TypeApiAddCatalogRes {
  Message: string
}

export interface TypeApiDeleteCatalogReq {
  id: number
}

export interface TypeApiDeleteCatalogRes {
  Message: string
}

export type TypeApiGetCatalogsRes = TypeApiCatalog[]

/*<====================================>*/
// Permission
/*<====================================>*/
export type TypeApiShowPermissionReq = {
  id: number
}
export type TypeApiShowPermissionRes = TypeApiPermission

export type TypeApiUpdatePermissionReq = TypeApiPermission

export interface TypeApiUpdatePermissionRes {
  Message: string
}

/*<====================================>*/
// Connection
/*<====================================>*/
export type TypeApiGetConnectionsRes = TypeApiConnection[]

export type TypeApiUpdateConnectionReq = TypeApiConnection

export interface TypeApiUpdateConnectionRes {
  Message: string
}

/*<====================================>*/
// Email
/*<====================================>*/
export interface TypeApiSendEmailReq {
  content?: string
  title: string
  subject: string
  text: string
  email: string
  trackingCode: string
  dateName: string
  date: string
  time: string
  service: string
  provider: string
}

export interface TypeApiSendEmailRes {
  Message: string
}

/*<====================================>*/
// Sms
/*<====================================>*/
export type TypeApiSendSmsReq = object

export interface TypeApiSendSmsRes {
  status: boolean
  data: unknown
}

/*<====================================>*/
// Setting
/*<====================================>*/
export type TypeApiGetSettingsRes = TypeApiSetting[]

export type TypeApiUpdateSettingReq = TypeApiSetting

export interface TypeApiUpdateSettingRes {
  Message: string
}

/*<====================================>*/
// User
/*<====================================>*/
export interface TypeApiAddUserReq {
  catalogId: number
  codeMeli: string
  gender: TypeGender
  fullName: string
  mobile: string
  email: string
  password: string
  locked: string
}

export interface TypeApiAddUserRes {
  Message: string
}

export interface TypeApiDeleteUserReq {
  id: string
}

export interface TypeApiDeleteUserRes {
  Message: string
}

export type TypeApiGetUsersRes = TypeApiUser & {
  catalog: TypeApiCatalog
}

export type TypeApiShowUserReq = {
  id: string
}
export type TypeApiShowUserRes = TypeApiUser

export type TypeApiUpdateUserReq = {
  id: string
  catalogId: number
  codeMeli: string
  gender: TypeGender
  fullName: string
  mobile: string
  email: string
  password?: string
  locked: string
}

export interface TypeApiUpdateUserRes {
  Message: string
}

export interface TypeApiImportUsersReq {
  codeMeli: string
  fullName: string
  mobile: string
  email: string
}

export interface TypeApiImportUsersRes {
  CountSuccess: number
  CountError: number
}

export interface TypeApiGetUsersByCatalogIdReq {
  id: number
}

export type TypeApiGetUsersByCatalogIdRes = TypeApiUser

/*<====================================>*/
// Service
/*<====================================>*/
export interface TypeFormService {
  userId: string

  name: string
  periodTime: string
  price: string
  capacity: string

  startDate: DateObject | null
  endDate: DateObject | null

  gender: TypeGender

  codPayment: boolean
  onlinePayment: boolean

  smsToAdminService: boolean
  smsToAdminProvider: boolean
  smsToUserService: boolean

  emailToAdminService: boolean
  emailToAdminProvider: boolean
  emailToUserService: boolean

  description: string | null
  descriptionAfterPurchase: string | null
}

export interface TypeApiAddServiceReq {
  userId: string

  name: string
  periodTime: number
  price: number
  capacity: number

  startDate: string | null
  endDate: string | null

  gender: TypeGender

  codPayment: boolean
  onlinePayment: boolean

  smsToAdminService: boolean
  smsToAdminProvider: boolean
  smsToUserService: boolean

  emailToAdminService: boolean
  emailToAdminProvider: boolean
  emailToUserService: boolean

  description: string | null
  descriptionAfterPurchase: string | null
}

export interface TypeApiAddServiceRes {
  Message: string
}

export interface TypeApiDeleteServiceReq {
  id: number
}

export interface TypeApiDeleteServiceRes {
  Message: string
}

export type TypeApiGetServicesRes = TypeApiService & {
  user: TypeApiUser
}

export type TypeApiShowServiceReq = {
  id: number
}
export type TypeApiShowServiceRes = TypeApiService

export type TypeApiUpdateServiceReq = {
  id: number

  userId: string

  name: string
  periodTime: number
  price: number
  capacity: number

  startDate: string | null
  endDate: string | null

  gender: TypeGender

  codPayment: boolean
  onlinePayment: boolean

  smsToAdminService: boolean
  smsToAdminProvider: boolean
  smsToUserService: boolean

  emailToAdminService: boolean
  emailToAdminProvider: boolean
  emailToUserService: boolean

  description: string | null
  descriptionAfterPurchase: string | null

}

export interface TypeApiUpdateServiceRes {
  Message: string
}

/*<====================================>*/
// Provider
/*<====================================>*/

export interface TypeFormProvider {
  serviceId: number

  userId: string

  slotTime: number

  startDate: DateObject | null
  endDate: DateObject | null

  startTime: DateObject | null
  endTime: DateObject | null

  status: string
  workHolidays: string
  description: string | null
}

export interface TypeApiAddProviderReq {
  serviceId: number

  userId: string

  slotTime: number

  startDate: string | null
  endDate: string | null

  startTime: string | null
  endTime: string | null

  status: boolean
  workHolidays: boolean
  description: string | null
}

export interface TypeApiAddProviderRes {
  Message: string
}

export interface TypeApiDeleteProviderReq {
  id: number
}

export interface TypeApiDeleteProviderRes {
  Message: string
}

export type TypeApiGetProvidersRes = TypeApiProvider & {
  service: TypeApiService
  user: TypeApiUser
}

export type TypeApiShowProviderReq = {
  id: number
}
export type TypeApiShowProviderRes = TypeApiProvider & {
  service: TypeApiService
  user: TypeApiUser
}

export type TypeApiUpdateProviderReq = {
  id: number

  serviceId: number

  userId: string

  slotTime: number

  startDate: string | null
  endDate: string | null

  startTime: string | null
  endTime: string | null

  status: boolean
  workHolidays: boolean
  description: string | null
}

export interface TypeApiUpdateProviderRes {
  Message: string
}

export interface TypeApiGetProvidersByServiceIdReq {
  id: number
}

export type TypeApiGetProvidersByServiceIdRes = TypeApiProvider & {
  service: TypeApiService
  user: TypeApiUser
}

/*<====================================>*/
// TimeSheet
/*<====================================>*/

export interface TypeFormTimeSheet {
  // serviceId: number;

  // providerId: number;

  dayName: string
  dayIndex: number
  startTime: DateObject | null
  endTime: DateObject | null
}

export interface TypeApiAddTimeSheetReq {
  serviceId: number

  providerId: number

  dayName: string
  dayIndex: number
  startTime: string
  endTime: string
}

export interface TypeApiAddTimeSheetRes {
  Message: string
}

export interface TypeApiDeleteTimeSheetReq {
  id: number
}

export interface TypeApiDeleteTimeSheetRes {
  Message: string
}

export type TypeApiShowTimeSheetReq = {
  id: number
}
export type TypeApiShowTimeSheetRes = TypeApiTimeSheet

/*<====================================>*/
// Orders
/*<====================================>*/

export type TypeApiGetOrdersRes = TypeApiOrder & {
  discount: TypeApiDiscount
  payment: TypeApiPayment
  Reservations: (TypeApiReservation &  {
    user: TypeApiUser
    service: TypeApiService &{
      user: TypeApiUser
    }
    provider: TypeApiProvider &{
      user: TypeApiUser
    }
  })[]
}

/*<====================================>*/
// Reservation
/*<====================================>*/

export interface TypeApiAddReservationReq {
  shouldExecuteTransaction: boolean
  trackingCode: string
  paymentType: TypePaymentType
  status: TypeReservationsStatus

  service: TypeApiService
  provider: TypeApiProvider
  user: TypeApiUser

  price: number
  totalPrice: number

  date: string
  time: string

  description: string | null

  discountId?: number
  discountPrice?: number

  bankName?: string
  trackId?: string
  amount?: string
  cardNumber?: string
  authority?: string
}

export interface TypeApiAddReservationRes {
  Message: string
}

export interface TypeApiDeleteReservationReq {
  id: string
}

export interface TypeApiDeleteReservationRes {
  Message: string
}

export type TypeApiGetReservationsReq = {
  startEpoch: number
  endEpoch: number
}

export type TypeApiGetReservationsRes = (TypeApiReservation & {
  user: TypeApiUser
  service: TypeApiService & {
    user: TypeApiUser
  }
  provider: TypeApiProvider & {
    user: TypeApiUser
  }
  order: TypeApiOrder & {
    payment: TypeApiPayment & {
      transaction: TypeApiTransaction
    }
    discount: TypeApiDiscount
  }
})

//
// export type TypeApiGetReservationsRes = TypeApiReservation & {
//   order: TypeApiOrder & {
//     payment: TypeApiPayment & {
//       transaction: TypeApiTransaction
//     }
//     discount: TypeApiDiscount
//     user: TypeApiUser
//     provider: TypeApiProvider & {
//       service: TypeApiService
//       user: TypeApiUser
//     }
//   }
// }

export type TypeApiShowReservationReq = {
  id: number
}
export type TypeApiShowReservationRes = TypeApiReservation

export type TypeApiUpdateReservationReq = {
  id: number
  title: string
  code: string
  startDate?: string | null
  endDate?: string | null
  // type: TypeReservationsType;
  amount: number
}

export interface TypeApiUpdateReservationRes {
  Message: string
}

export type TypeApiUpdateStatusReservationReq = {
  reserve: TypeApiReservation
  statusReserve: TypeStatusReserve
  status: TypeReservationsStatus

  smsChangeStatusToAdminProvider?: boolean
  smsChangeStatusToUserService?: boolean
  emailChangeStatusToAdminProvider?: boolean
  emailChangeStatusToUserService?: boolean

  smsStatusDoneToAdminProvider?: boolean
  smsStatusDoneToUserService?: boolean
  emailStatusDoneToAdminProvider?: boolean
  emailStatusDoneToUserService?: boolean
}

export interface TypeApiUpdateStatusReservationRes {
  Message: string
}

export interface TypeApiReminderReservationReq {
  reserve: TypeApiReservation
  smsReminderToAdminProvider: boolean
  smsReminderToUserService: boolean
  emailReminderToAdminProvider: boolean
  emailReminderToUserService: boolean
}

export interface TypeApiReminderReservationRes {
  Message: string
}

export interface TypeApiAppreciationReservationReq {
  reserve: TypeApiReservation
  discountCode: string
  smsAppreciationToAdminProvider: boolean
  smsAppreciationToUserService: boolean
  emailAppreciationToAdminProvider: boolean
  emailAppreciationToUserService: boolean
}

export interface TypeApiAppreciationReservationRes {
  Message: string
}

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
export type TypeApiGetReservationsByUserIdRes = (TypeApiReservation & {
  user: TypeApiUser
  service: TypeApiService & {
    user: TypeApiUser
  }
  provider: TypeApiProvider & {
    user: TypeApiUser
  }
  order: TypeApiOrder & {
    payment: TypeApiPayment & {
      transaction: TypeApiTransaction
    }
    discount: TypeApiDiscount
  }
})
