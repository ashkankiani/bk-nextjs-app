import {deleteRequest, getRequest, postRequest, putRequest} from '@/api/apiRequest'
import {
    TypeApiAddFaqReq,
    TypeApiAddFaqRes,
    TypeApiDeleteFaqRes,
    TypeApiUpdateFaqRes,
    TypeApiDeleteFaqReq,
    TypeApiGetFaqsRes,
    TypeApiShowFaqRes, TypeApiUpdateFaqReq, TypeApiShowFaqReq
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
