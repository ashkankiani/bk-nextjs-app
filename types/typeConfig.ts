import { ReactNode } from 'react'

/*<====================================>*/
// Api Config
/*<====================================>*/
export type TypeHeaders = {
  [key: string]: string
}

export interface TypeApiCustomError extends Error {
  Code: number
  Reason: string
  Details?: object
}

export interface TypeApiSuccess {
  code?: number
  reason?: string
}

interface EndpointApiRoutes {
  [key: string]: string
}

export type TypeApiRoutesAdmin = {
  Faq: EndpointApiRoutes
  Holiday: EndpointApiRoutes
  Discount: EndpointApiRoutes
  Catalog: EndpointApiRoutes
  Permission: EndpointApiRoutes
  Connection: EndpointApiRoutes
  Email: EndpointApiRoutes
  Sms: EndpointApiRoutes
  Setting: EndpointApiRoutes
  User: EndpointApiRoutes
  Service: EndpointApiRoutes
  Provider: EndpointApiRoutes
  TimeSheet: EndpointApiRoutes
  Order: EndpointApiRoutes
  Reservation: EndpointApiRoutes
}

export type TypeApiRoutesUser = {
  Setting: EndpointApiRoutes
  Service: EndpointApiRoutes
  Provider: EndpointApiRoutes
  Auth: EndpointApiRoutes
  Reservation: EndpointApiRoutes
  Connection: EndpointApiRoutes
  Discount: EndpointApiRoutes
  Gateway: EndpointApiRoutes
  Order: EndpointApiRoutes
  Faq: EndpointApiRoutes
  // Holiday: EndpointApiRoutes
}

export type TypeApiResponse = {
  Code: number
  Message: string
}

export type TypeGender = 'NONE' | 'WOMAN' | 'MAN'
export type TypeDiscountsType = 'CONSTANT' | 'PERCENT'
export type TypePay = 'Paid' | 'Unpaid'
export type TypeBankName = 'NONE' | 'ZARINPAL' | 'IDPAY' | 'AQAYEPARDAKHT' | 'ZIBAL'
export type TypeOrderMethod = 'ZARINPAL' | 'IDPAY' | 'AQAYEPARDAKHT' | 'ZIBAL' | 'COD'
export type TypeReservationsStatus =
  | 'REVIEW'
  | 'COMPLETED'
  | 'DONE'
  | 'CANCELED'
  | 'REJECTED'
  | 'PENDING'
  | 'RESET'
export type TypeOrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELED'
export type TypePaymentType =
  | 'OnlinePayment'
  | 'CashPayment'
  | 'CartByCart'
  | 'CardReader'
  | 'Free'
  | 'UnknownPayment'
export type TypeToast = 'success' | 'error' | 'info' | 'warning'
export type TypeTheme = 'THEME1' | 'THEME2' | 'THEME3'
export type TypeCancellationReservation =
  | 'NONE'
  | 'ADMIN'
  | 'PROVIDER'
  | 'USER'
  | 'ADMIN_PROVIDER'
  | 'ADMIN_USER'
  | 'PROVIDER_USER'
  | 'ADMIN_PROVIDER_USER'
export type TypeEmailStatus = 'OPTIONAL' | 'MANDATORY' | 'DELETE'
export type TypeSmsName = 'NONE' | 'IPPANEL' | 'MELIPAYAMAK' | 'KAVENEGAR' | 'FARAZSMS' | 'SMSIR'
export type TypePermissionKeys =
  | 'id'
  | 'catalogId'
  | 'admin'
  | 'viewDashboard'
  | 'viewReservation'
  | 'addReservation'
  | 'editReservation'
  | 'deleteReservation'
  | 'viewDraft'
  | 'deleteDraft'
  | 'viewServices'
  | 'addServices'
  | 'editServices'
  | 'deleteServices'
  | 'viewProviders'
  | 'addProviders'
  | 'editProviders'
  | 'deleteProviders'
  | 'viewTimesheets'
  | 'addTimesheets'
  | 'deleteTimesheets'
  | 'viewFinancial'
  | 'viewHolidays'
  | 'addHolidays'
  | 'editHolidays'
  | 'deleteHolidays'
  | 'viewDiscounts'
  | 'addDiscounts'
  | 'editDiscounts'
  | 'deleteDiscounts'
  | 'viewUsers'
  | 'addUsers'
  | 'editUsers'
  | 'deleteUsers'
  | 'exportUsers'
  | 'importUsers'
  | 'viewFaqs'
  | 'addFaqs'
  | 'editFaqs'
  | 'deleteFaqs'
  | 'viewSettings'
  | 'editSettings'
  | 'viewConnections'
  | 'editConnections'
  | 'viewCatalogs'
  | 'addCatalogs'
  | 'editCatalogs'
  | 'deleteCatalogs'

export type TypeSession = { userId: number; catalogId: number }

export type MenuItem = {
  title: string
  name: string
  icon: ReactNode
  permission: boolean
}

export type TypeMenu = {
  dashboard: MenuItem
  reservation: MenuItem
  draft: MenuItem
  services: MenuItem
  providers: MenuItem
  financial: MenuItem
  holidays: MenuItem
  discounts: MenuItem
  users: MenuItem
  faqs: MenuItem
  settings: MenuItem
  connections: MenuItem
  catalogs: MenuItem
}

// hint: بررسی بشه این اسمش تغییرکنه
export type TypeStatusReserve = 'THANK' | 'YES' | 'NO'
