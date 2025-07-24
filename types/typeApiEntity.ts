import {
  TypeBankName,
  TypeCancellationReservation,
  TypeDiscountsType,
  TypeEmailStatus,
  TypeGender, TypeOrderStatus,
  TypePaymentType,
  TypeReservationsStatus,
  TypeSmsName,
  TypeTheme,
} from '@/types/typeConfig'

export interface TypeApiFaq {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}
export interface TypeApiHoliday {
  id: number
  title: string
  date: string
  createdAt: Date
  updatedAt: Date
}
export interface TypeApiDiscount {
  id: number
  title: string
  code: string
  startDate: string | null
  endDate: string | null
  type: TypeDiscountsType
  amount: number
  createdAt: Date
  updatedAt: Date
}
export interface TypeApiCatalog {
  id: number
  title: string
}
export interface TypeApiPermission {
  id: number
  catalogId: number
  admin: boolean
  viewDashboard: boolean
  viewReservation: boolean
  addReservation: boolean
  editReservation: boolean
  deleteReservation: boolean
  viewDraft: boolean
  deleteDraft: boolean
  viewServices: boolean
  addServices: boolean
  editServices: boolean
  deleteServices: boolean
  viewProviders: boolean
  addProviders: boolean
  editProviders: boolean
  deleteProviders: boolean
  viewTimesheets: boolean
  addTimesheets: boolean
  deleteTimesheets: boolean
  viewFinancial: boolean
  viewHolidays: boolean
  addHolidays: boolean
  editHolidays: boolean
  deleteHolidays: boolean
  viewDiscounts: boolean
  addDiscounts: boolean
  editDiscounts: boolean
  deleteDiscounts: boolean
  viewUsers: boolean
  addUsers: boolean
  editUsers: boolean
  deleteUsers: boolean
  exportUsers: boolean
  importUsers: boolean
  viewFaqs: boolean
  addFaqs: boolean
  editFaqs: boolean
  deleteFaqs: boolean
  viewSettings: boolean
  editSettings: boolean
  viewConnections: boolean
  editConnections: boolean
  viewCatalogs: boolean
  addCatalogs: boolean
  editCatalogs: boolean
  deleteCatalogs: boolean
  getSms: boolean
  getEmail: boolean
}
export interface TypeApiConnection {
  id: number

  bankName1: TypeBankName
  merchantId1: string | null

  bankName2: TypeBankName
  merchantId2: string | null

  smsName: TypeSmsName

  smsURL: string | null
  smsToken: string | null
  smsUserName: string | null
  smsPassword: string | null
  smsFrom: string | null

  smsCodePattern1: string | null
  smsCodePattern2: string | null
  smsCodePattern3: string | null
  smsCodePattern4: string | null
  smsCodePattern5: string | null
  smsCodePattern6: string | null
  smsCodePattern7: string | null
  smsCodePattern8: string | null

  smtpURL: string | null
  smtpPort: number | null
  smtpUserName: string | null
  smtpPassword: string | null

  createdAt: Date
  updatedAt: Date
}
export interface TypeApiSetting {
  id: number
  name: string
  url: string
  address: string
  phone: string
  theme: TypeTheme

  minReservationDate: number
  maxReservationDate: number
  minReservationTime: number
  cancellationDeadline: number
  maxReservationDaily: number
  maxReservationMonthly: number

  automaticConfirmation: boolean
  cancellationReservationUser: boolean

  smsCancellationReservation: TypeCancellationReservation
  emailCancellationReservation: TypeCancellationReservation

  groupReservation: boolean
  emailStatus: TypeEmailStatus

  shiftWorkStatus: boolean
  permissionSearchShiftWork: boolean

  registerOTP: boolean
  loginOTP: boolean

  cart: boolean
  minReservationLock: number
  guestReservation: boolean

  // headerCode?: string;
  footerCode: string | null
  code: string

  createdAt: Date
  updatedAt: Date
}
export interface TypeApiUser {
  id: number
  catalogId: number
  codeMeli: string
  fullName: string
  mobile: string
  email: string | null
  password: string
  gender: TypeGender
  locked: boolean
  createdAt: Date
  updatedAt: Date
}
export interface TypeApiService {
  id: number

  userId: number

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

  createdAt: Date
  updatedAt: Date
}
export interface TypeApiProvider {
  id: number

  serviceId: number

  userId: number

  slotTime: number

  startDate: string | null
  endDate: string | null

  startTime: string | null
  endTime: string | null

  status: boolean
  workHolidays: boolean
  description: string | null

  createdAt: Date
  updatedAt: Date
}
export interface TypeApiTimeSheet {
  id: number

  serviceId: number

  providerId: number

  dayName: string
  dayIndex: number
  startTime: string
  endTime: string

  createdAt: Date
  updatedAt: Date
}
export interface TypeApiOrder {
  id: number
  trackingCode: string

  bankName: TypeBankName

  bankTransactionCode: string | null

  status: TypeOrderStatus

  userId: number

  serviceId: number

  providerId: number

  paymentId: number | null

  discountId: number | null

  price: number
  discountPrice: number | null
  totalPrice: number

  reservations: TypeApiReservation[]

  createdAt: Date
  updatedAt: Date
}
export interface TypeApiPayment {
  id: number

  paymentType: TypePaymentType

  userId: number

  transactionId: number | null

  description: string | null

  orders: TypeApiOrder[]
  reservations: TypeApiReservation[]

  createdAt: Date
  updatedAt: Date
}
export interface TypeApiReservation {
  id: number

  orderId: number | null

  paymentId: number | null

  transactionId: number | null

  serviceId: number

  providerId: number

  userId: number

  dateTimeStartEpoch: bigint
  dateTimeEndEpoch: bigint
  date: string
  time: string

  status: TypeReservationsStatus

  expiresAt:  number | null

  createdAt: Date
  updatedAt: Date
}
export interface TypeApiDraft {
  createEpoch: bigint

  serviceId: number

  providerId: number

  userId?: number

  dateTimeStartEpoch: bigint
  dateTimeEndEpoch: bigint
  date: string
  time: string

  createdAt: Date
  updatedAt: Date
}
export interface TypeApiTransaction {
  id: number

  bankName: TypeBankName
  authority: string
  // trackId: string
  amount: number
  cardNumber: string

  payments: TypeApiPayment[]
  reservations: TypeApiReservation[]

  createdAt: Date
  updatedAt: Date
}
