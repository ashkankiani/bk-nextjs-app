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
    TypeApiUpdateDiscountRes, TypeApiShowDiscountRes, TypeApiGetDiscountsRes
} from "@/types/typeApi";
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
