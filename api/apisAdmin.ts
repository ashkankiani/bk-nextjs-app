import {deleteRequest, getRequest, postRequest, putRequest} from '@/api/apiRequest'
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
    TypeApiGetUsersRes, TypeApiShowUserReq, TypeApiUpdateUserReq, TypeApiUpdateUserRes, TypeApiShowUserRes
} from "@/types/typeApiAdmin";
import {ApiRoutesAdmin} from "@/api/apiRoutesAdmin";


/*<====================================>*/
// Faq
/*<====================================>*/
export const AddFaq = (params: TypeApiAddFaqReq) => postRequest<TypeApiAddFaqRes>(ApiRoutesAdmin.Faq.AddFaq, params)
export const DeleteFaq = (params: TypeApiDeleteFaqReq) => deleteRequest<TypeApiDeleteFaqRes>(ApiRoutesAdmin.Faq.DeleteFaq, params)
export const GetFaqs = () => getRequest<TypeApiGetFaqsRes>(ApiRoutesAdmin.Faq.GetFaqs)
export const ShowFaq = (params: TypeApiShowFaqReq) => getRequest<TypeApiShowFaqRes>(ApiRoutesAdmin.Faq.ShowFaq , params)
export const UpdateFaq = (params: TypeApiUpdateFaqReq) => putRequest<TypeApiUpdateFaqRes>(ApiRoutesAdmin.Faq.UpdateFaq, params)


/*<====================================>*/
// Holiday
/*<====================================>*/
export const AddHoliday = (params: TypeApiAddHolidayReq) => postRequest<TypeApiAddHolidayRes>(ApiRoutesAdmin.Holiday.AddHoliday, params)
export const DeleteHoliday = (params: TypeApiDeleteHolidayReq) => deleteRequest<TypeApiDeleteHolidayRes>(ApiRoutesAdmin.Holiday.DeleteHoliday, params)
export const GetHolidays = () => getRequest<TypeApiGetHolidaysRes>(ApiRoutesAdmin.Holiday.GetHolidays)
export const ShowHoliday = (params: TypeApiShowHolidayReq) => getRequest<TypeApiShowHolidayRes>(ApiRoutesAdmin.Holiday.ShowHoliday , params)
export const UpdateHoliday = (params: TypeApiUpdateHolidayReq) => putRequest<TypeApiUpdateHolidayRes>(ApiRoutesAdmin.Holiday.UpdateHoliday, params)


/*<====================================>*/
// Discount
/*<====================================>*/
export const AddDiscount = (params: TypeApiAddDiscountReq) => postRequest<TypeApiAddDiscountRes>(ApiRoutesAdmin.Discount.AddDiscount, params)
export const DeleteDiscount = (params: TypeApiDeleteDiscountReq) => deleteRequest<TypeApiDeleteDiscountRes>(ApiRoutesAdmin.Discount.DeleteDiscount, params)
export const GetDiscounts = () => getRequest<TypeApiGetDiscountsRes>(ApiRoutesAdmin.Discount.GetDiscounts)
export const ShowDiscount = (params: TypeApiShowDiscountReq) => getRequest<TypeApiShowDiscountRes>(ApiRoutesAdmin.Discount.ShowDiscount , params)
export const UpdateDiscount = (params: TypeApiUpdateDiscountReq) => putRequest<TypeApiUpdateDiscountRes>(ApiRoutesAdmin.Discount.UpdateDiscount, params)



/*<====================================>*/
// Catalog
/*<====================================>*/
export const AddCatalog = (params: TypeApiAddCatalogReq) => postRequest<TypeApiAddCatalogRes>(ApiRoutesAdmin.Catalog.AddCatalog, params)
export const DeleteCatalog = (params: TypeApiDeleteCatalogReq) => deleteRequest<TypeApiDeleteCatalogRes>(ApiRoutesAdmin.Catalog.DeleteCatalog, params)
export const GetCatalogs = () => getRequest<TypeApiGetCatalogsRes>(ApiRoutesAdmin.Catalog.GetCatalogs)

/*<====================================>*/
// Permission
/*<====================================>*/
export const ShowPermission = (params: TypeApiShowPermissionReq) => getRequest<TypeApiShowPermissionRes>(ApiRoutesAdmin.Permission.ShowPermission , params)
export const UpdatePermission = (params: TypeApiUpdatePermissionReq) => putRequest<TypeApiUpdatePermissionRes>(ApiRoutesAdmin.Permission.UpdatePermission, params)


/*<====================================>*/
// Connection
/*<====================================>*/
export const GetConnections = () => getRequest<TypeApiGetConnectionsRes>(ApiRoutesAdmin.Connection.GetConnections)
export const UpdateConnection = (params: TypeApiUpdateConnectionReq) => putRequest<TypeApiUpdateConnectionRes>(ApiRoutesAdmin.Connection.UpdateConnection, params)


/*<====================================>*/
// Email
/*<====================================>*/
export const SendEmail = (params: TypeApiSendEmailReq) => postRequest<TypeApiSendEmailRes>(ApiRoutesAdmin.Email.SendEmail, params)

/*<====================================>*/
// Sms
/*<====================================>*/
export const SendSms = (params: TypeApiSendSmsReq) => postRequest<TypeApiSendSmsRes>(ApiRoutesAdmin.Sms.SendSms, params)

/*<====================================>*/
// Setting
/*<====================================>*/
export const GetSettings = () => getRequest<TypeApiGetSettingsRes>(ApiRoutesAdmin.Setting.GetSettings)
export const UpdateSetting = (params: TypeApiUpdateSettingReq) => putRequest<TypeApiUpdateSettingRes>(ApiRoutesAdmin.Setting.UpdateSetting, params)


/*<====================================>*/
// User
/*<====================================>*/
export const AddUser = (params: TypeApiAddUserReq) => postRequest<TypeApiAddUserRes>(ApiRoutesAdmin.User.AddUser, params)
export const DeleteUser = (params: TypeApiDeleteUserReq) => deleteRequest<TypeApiDeleteUserRes>(ApiRoutesAdmin.User.DeleteUser, params)
export const GetUsers = () => getRequest<TypeApiGetUsersRes[]>(ApiRoutesAdmin.User.GetUsers)
export const ShowUser = (params: TypeApiShowUserReq) => getRequest<TypeApiShowUserRes>(ApiRoutesAdmin.User.ShowUser , params)
export const UpdateUser = (params: TypeApiUpdateUserReq) => putRequest<TypeApiUpdateUserRes>(ApiRoutesAdmin.User.UpdateUser, params)