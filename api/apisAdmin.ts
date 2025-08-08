import { deleteRequest, getRequest, postRequest, putRequest } from '@/api/apiRequest'
import {
  TypeApiAddFaqReq,
  TypeApiAddFaqRes,
  TypeApiDeleteFaqRes,
  TypeApiUpdateFaqRes,
  TypeApiDeleteFaqReq,
  TypeApiGetFaqsRes,
  TypeApiShowFaqRes,
  TypeApiUpdateFaqReq,
  TypeApiShowFaqReq,
  TypeApiAddHolidayReq,
  TypeApiAddHolidayRes,
  TypeApiDeleteHolidayReq,
  TypeApiShowHolidayReq,
  TypeApiUpdateHolidayReq,
  TypeApiUpdateHolidayRes,
  TypeApiDeleteHolidayRes,
  TypeApiGetHolidaysRes,
  TypeApiShowHolidayRes,
  TypeApiAddDiscountReq,
  TypeApiAddDiscountRes,
  TypeApiDeleteDiscountRes,
  TypeApiDeleteDiscountReq,
  TypeApiShowDiscountReq,
  TypeApiUpdateDiscountReq,
  TypeApiUpdateDiscountRes,
  TypeApiShowDiscountRes,
  TypeApiGetDiscountsRes,
  TypeApiAddCatalogReq,
  TypeApiDeleteCatalogReq,
  TypeApiAddCatalogRes,
  TypeApiDeleteCatalogRes,
  TypeApiGetCatalogsRes,
  TypeApiShowPermissionReq,
  TypeApiUpdatePermissionReq,
  TypeApiShowPermissionRes,
  TypeApiUpdatePermissionRes,
  TypeApiGetConnectionsRes,
  TypeApiUpdateConnectionReq,
  TypeApiUpdateConnectionRes,
  TypeApiSendEmailReq,
  TypeApiSendEmailRes,
  TypeApiSendSmsReq,
  TypeApiSendSmsRes,
  TypeApiGetSettingsRes,
  TypeApiUpdateSettingReq,
  TypeApiUpdateSettingRes,
  TypeApiAddUserReq,
  TypeApiAddUserRes,
  TypeApiDeleteUserReq,
  TypeApiDeleteUserRes,
  TypeApiGetUsersRes,
  TypeApiShowUserReq,
  TypeApiUpdateUserReq,
  TypeApiUpdateUserRes,
  TypeApiShowUserRes,
  TypeApiImportUsersReq,
  TypeApiImportUsersRes,
  TypeApiAddServiceReq,
  TypeApiDeleteServiceReq,
  TypeApiShowServiceReq,
  TypeApiUpdateServiceReq,
  TypeApiGetServicesRes,
  TypeApiAddServiceRes,
  TypeApiDeleteServiceRes,
  TypeApiShowServiceRes,
  TypeApiUpdateServiceRes,
  TypeApiGetUsersByCatalogIdRes,
  TypeApiGetUsersByCatalogIdReq,
  TypeApiAddProviderReq,
  TypeApiDeleteProviderReq,
  TypeApiShowProviderReq,
  TypeApiUpdateProviderReq,
  TypeApiGetProvidersRes,
  TypeApiAddProviderRes,
  TypeApiDeleteProviderRes,
  TypeApiShowProviderRes,
  TypeApiUpdateProviderRes,
  TypeApiGetProvidersByServiceIdReq,
  TypeApiGetProvidersByServiceIdRes,
  TypeApiAddTimeSheetReq,
  TypeApiDeleteTimeSheetReq,
  TypeApiShowTimeSheetReq,
  TypeApiAddTimeSheetRes,
  TypeApiDeleteTimeSheetRes,
  TypeApiShowTimeSheetRes,
  TypeApiGetOrdersRes,
  TypeApiGetDraftsRes,
  TypeApiDeleteDraftsRes,
  TypeApiGetReservationsReq,
  TypeApiGetReservationsRes,
  TypeApiDeleteReservationReq,
  TypeApiDeleteReservationRes,
  TypeApiUpdateStatusReservationReq,
  TypeApiUpdateStatusReservationRes,
  TypeApiReminderReservationReq,
  TypeApiReminderReservationRes,
  TypeApiAppreciationReservationReq,
  TypeApiAppreciationReservationRes,
  TypeApiAvailableTimesReq,
  TypeApiAvailableTimesRes,
  TypeApiAddReservationReq,
  TypeApiAddReservationRes, TypeApiGetReservationsByUserIdReq, TypeApiGetReservationsByUserIdRes,
} from '@/types/typeApiAdmin'
import { ApiRoutesAdmin } from '@/api/apiRoutesAdmin'

/*<====================================>*/
// Faq
/*<====================================>*/
export const AddFaq = (params: TypeApiAddFaqReq) =>
  postRequest<TypeApiAddFaqRes>(ApiRoutesAdmin.Faq.AddFaq, params)
export const DeleteFaq = (params: TypeApiDeleteFaqReq) =>
  deleteRequest<TypeApiDeleteFaqRes>(ApiRoutesAdmin.Faq.DeleteFaq, params)
export const GetFaqs = () => getRequest<TypeApiGetFaqsRes>(ApiRoutesAdmin.Faq.GetFaqs)
export const ShowFaq = (params: TypeApiShowFaqReq) =>
  getRequest<TypeApiShowFaqRes>(ApiRoutesAdmin.Faq.ShowFaq, params)
export const UpdateFaq = (params: TypeApiUpdateFaqReq) =>
  putRequest<TypeApiUpdateFaqRes>(ApiRoutesAdmin.Faq.UpdateFaq, params)

/*<====================================>*/
// Holiday
/*<====================================>*/
export const AddHoliday = (params: TypeApiAddHolidayReq) =>
  postRequest<TypeApiAddHolidayRes>(ApiRoutesAdmin.Holiday.AddHoliday, params)
export const DeleteHoliday = (params: TypeApiDeleteHolidayReq) =>
  deleteRequest<TypeApiDeleteHolidayRes>(ApiRoutesAdmin.Holiday.DeleteHoliday, params)
export const GetHolidays = () =>
  getRequest<TypeApiGetHolidaysRes>(ApiRoutesAdmin.Holiday.GetHolidays)
export const ShowHoliday = (params: TypeApiShowHolidayReq) =>
  getRequest<TypeApiShowHolidayRes>(ApiRoutesAdmin.Holiday.ShowHoliday, params)
export const UpdateHoliday = (params: TypeApiUpdateHolidayReq) =>
  putRequest<TypeApiUpdateHolidayRes>(ApiRoutesAdmin.Holiday.UpdateHoliday, params)

/*<====================================>*/
// Discount
/*<====================================>*/
export const AddDiscount = (params: TypeApiAddDiscountReq) =>
  postRequest<TypeApiAddDiscountRes>(ApiRoutesAdmin.Discount.AddDiscount, params)
export const DeleteDiscount = (params: TypeApiDeleteDiscountReq) =>
  deleteRequest<TypeApiDeleteDiscountRes>(ApiRoutesAdmin.Discount.DeleteDiscount, params)
export const GetDiscounts = () =>
  getRequest<TypeApiGetDiscountsRes[]>(ApiRoutesAdmin.Discount.GetDiscounts)
export const ShowDiscount = (params: TypeApiShowDiscountReq) =>
  getRequest<TypeApiShowDiscountRes>(ApiRoutesAdmin.Discount.ShowDiscount, params)
export const UpdateDiscount = (params: TypeApiUpdateDiscountReq) =>
  putRequest<TypeApiUpdateDiscountRes>(ApiRoutesAdmin.Discount.UpdateDiscount, params)

/*<====================================>*/
// Catalog
/*<====================================>*/
export const AddCatalog = (params: TypeApiAddCatalogReq) =>
  postRequest<TypeApiAddCatalogRes>(ApiRoutesAdmin.Catalog.AddCatalog, params)
export const DeleteCatalog = (params: TypeApiDeleteCatalogReq) =>
  deleteRequest<TypeApiDeleteCatalogRes>(ApiRoutesAdmin.Catalog.DeleteCatalog, params)
export const GetCatalogs = () =>
  getRequest<TypeApiGetCatalogsRes>(ApiRoutesAdmin.Catalog.GetCatalogs)

/*<====================================>*/
// Permission
/*<====================================>*/
export const ShowPermission = (params: TypeApiShowPermissionReq) =>
  getRequest<TypeApiShowPermissionRes>(ApiRoutesAdmin.Permission.ShowPermission, params)
export const UpdatePermission = (params: TypeApiUpdatePermissionReq) =>
  putRequest<TypeApiUpdatePermissionRes>(ApiRoutesAdmin.Permission.UpdatePermission, params)

/*<====================================>*/
// Connection
/*<====================================>*/
export const GetConnections = () =>
  getRequest<TypeApiGetConnectionsRes>(ApiRoutesAdmin.Connection.GetConnections)
export const UpdateConnection = (params: TypeApiUpdateConnectionReq) =>
  putRequest<TypeApiUpdateConnectionRes>(ApiRoutesAdmin.Connection.UpdateConnection, params)

/*<====================================>*/
// Email
/*<====================================>*/
export const SendEmail = (params: TypeApiSendEmailReq) =>
  postRequest<TypeApiSendEmailRes>(ApiRoutesAdmin.Email.SendEmail, params)

/*<====================================>*/
// Sms
/*<====================================>*/
export const SendSms = (params: TypeApiSendSmsReq) =>
  postRequest<TypeApiSendSmsRes>(ApiRoutesAdmin.Sms.SendSms, params)

/*<====================================>*/
// Setting
/*<====================================>*/
export const GetSettings = () =>
  getRequest<TypeApiGetSettingsRes>(ApiRoutesAdmin.Setting.GetSettings)
export const UpdateSetting = (params: TypeApiUpdateSettingReq) =>
  putRequest<TypeApiUpdateSettingRes>(ApiRoutesAdmin.Setting.UpdateSetting, params)

/*<====================================>*/
// User
/*<====================================>*/
export const AddUser = (params: TypeApiAddUserReq) =>
  postRequest<TypeApiAddUserRes>(ApiRoutesAdmin.User.AddUser, params)
export const DeleteUser = (params: TypeApiDeleteUserReq) =>
  deleteRequest<TypeApiDeleteUserRes>(ApiRoutesAdmin.User.DeleteUser, params)
export const GetUsers = () => getRequest<TypeApiGetUsersRes[]>(ApiRoutesAdmin.User.GetUsers)
export const ShowUser = (params: TypeApiShowUserReq) =>
  getRequest<TypeApiShowUserRes>(ApiRoutesAdmin.User.ShowUser, params)
export const UpdateUser = (params: TypeApiUpdateUserReq) =>
  putRequest<TypeApiUpdateUserRes>(ApiRoutesAdmin.User.UpdateUser, params)
export const ImportUsers = (params: TypeApiImportUsersReq[]) =>
  postRequest<TypeApiImportUsersRes>(ApiRoutesAdmin.User.ImportUsers, params)
export const GetUsersByCatalogId = (params: TypeApiGetUsersByCatalogIdReq) =>
  getRequest<TypeApiGetUsersByCatalogIdRes[]>(ApiRoutesAdmin.User.GetUsersByCatalogId, params)

/*<====================================>*/
// Service
/*<====================================>*/
export const AddService = (params: TypeApiAddServiceReq) =>
  postRequest<TypeApiAddServiceRes>(ApiRoutesAdmin.Service.AddService, params)
export const DeleteService = (params: TypeApiDeleteServiceReq) =>
  deleteRequest<TypeApiDeleteServiceRes>(ApiRoutesAdmin.Service.DeleteService, params)
export const GetServices = () =>
  getRequest<TypeApiGetServicesRes[]>(ApiRoutesAdmin.Service.GetServices)
export const ShowService = (params: TypeApiShowServiceReq) =>
  getRequest<TypeApiShowServiceRes>(ApiRoutesAdmin.Service.ShowService, params)
export const UpdateService = (params: TypeApiUpdateServiceReq) =>
  putRequest<TypeApiUpdateServiceRes>(ApiRoutesAdmin.Service.UpdateService, params)

/*<====================================>*/
// Provider
/*<====================================>*/
export const AddProvider = (params: TypeApiAddProviderReq) =>
  postRequest<TypeApiAddProviderRes>(ApiRoutesAdmin.Provider.AddProvider, params)
export const DeleteProvider = (params: TypeApiDeleteProviderReq) =>
  deleteRequest<TypeApiDeleteProviderRes>(ApiRoutesAdmin.Provider.DeleteProvider, params)
export const GetProviders = () =>
  getRequest<TypeApiGetProvidersRes[]>(ApiRoutesAdmin.Provider.GetProviders)
export const ShowProvider = (params: TypeApiShowProviderReq) =>
  getRequest<TypeApiShowProviderRes>(ApiRoutesAdmin.Provider.ShowProvider, params)
export const UpdateProvider = (params: TypeApiUpdateProviderReq) =>
  putRequest<TypeApiUpdateProviderRes>(ApiRoutesAdmin.Provider.UpdateProvider, params)
export const GetProvidersByServiceId = (params: TypeApiGetProvidersByServiceIdReq) =>
  getRequest<TypeApiGetProvidersByServiceIdRes[]>(
    ApiRoutesAdmin.Provider.GetProvidersByServiceId,
    params
  )

/*<====================================>*/
// TimeSheet
/*<====================================>*/
export const AddTimeSheet = (params: TypeApiAddTimeSheetReq) =>
  postRequest<TypeApiAddTimeSheetRes>(ApiRoutesAdmin.TimeSheet.AddTimeSheet, params)
export const DeleteTimeSheet = (params: TypeApiDeleteTimeSheetReq) =>
  deleteRequest<TypeApiDeleteTimeSheetRes>(ApiRoutesAdmin.TimeSheet.DeleteTimeSheet, params)
export const ShowTimeSheet = (params: TypeApiShowTimeSheetReq) =>
  getRequest<TypeApiShowTimeSheetRes[]>(ApiRoutesAdmin.TimeSheet.ShowTimeSheet, params)

/*<====================================>*/
// Order
/*<====================================>*/
export const GetOrders = () => getRequest<TypeApiGetOrdersRes[]>(ApiRoutesAdmin.Order.GetOrders)

/*<====================================>*/
// Draft
/*<====================================>*/
export const GetDrafts = () => getRequest<TypeApiGetDraftsRes[]>(ApiRoutesAdmin.Draft.GetDrafts)
export const DeleteDrafts = () =>
  deleteRequest<TypeApiDeleteDraftsRes>(ApiRoutesAdmin.Draft.DeleteDrafts)

/*<====================================>*/
// Reservation
/*<====================================>*/
export const AddReservation = (params: TypeApiAddReservationReq) =>
  postRequest<TypeApiAddReservationRes>(ApiRoutesAdmin.Reservation.AddReservation, params)
export const DeleteReservation = (params: TypeApiDeleteReservationReq) =>
  deleteRequest<TypeApiDeleteReservationRes>(ApiRoutesAdmin.Reservation.DeleteReservation, params)
export const GetReservations = (params: TypeApiGetReservationsReq) =>
  getRequest<TypeApiGetReservationsRes[]>(ApiRoutesAdmin.Reservation.GetReservations, params)
// export const ShowReservation = (params: TypeApiShowReservationReq) => getRequest<TypeApiShowReservationRes>(ApiRoutesAdmin.Reservation.ShowReservation , params)
// export const UpdateReservation = (params: TypeApiUpdateReservationReq) => putRequest<TypeApiUpdateReservationRes>(ApiRoutesAdmin.Reservation.UpdateReservation, params)
export const UpdateStatusReservation = (params: TypeApiUpdateStatusReservationReq) =>
  putRequest<TypeApiUpdateStatusReservationRes>(
    ApiRoutesAdmin.Reservation.UpdateStatusReservation,
    params
  )
export const ReminderReservation = (params: TypeApiReminderReservationReq) =>
  postRequest<TypeApiReminderReservationRes>(ApiRoutesAdmin.Reservation.ReminderReservation, params)
export const AppreciationReservation = (params: TypeApiAppreciationReservationReq) =>
  postRequest<TypeApiAppreciationReservationRes>(
    ApiRoutesAdmin.Reservation.AppreciationReservation,
    params
  )
export const AvailableTimes = (params: TypeApiAvailableTimesReq) =>
  getRequest<TypeApiAvailableTimesRes[]>(
    ApiRoutesAdmin.Reservation.AvailableTimes,
    params
  )

export const GetReservationsByUserId = (params: TypeApiGetReservationsByUserIdReq) =>
    getRequest<TypeApiGetReservationsByUserIdRes[]>(
        ApiRoutesAdmin.Reservation.GetReservationsByUserId,
        params
    )
