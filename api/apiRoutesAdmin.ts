import {TypeApiRoutesAdmin} from "@/types/typeConfig";

export const ApiRoutesAdmin: TypeApiRoutesAdmin = {
    Faq: {
        AddFaq: '/admin/faq/addFaq',
        DeleteFaq: '/admin/faq/deleteFaq?',
        GetFaqs: '/admin/faq/getFaqs',
        ShowFaq: '/admin/faq/showFaq?',
        UpdateFaq: '/admin/faq/updateFaq',
    },

}
