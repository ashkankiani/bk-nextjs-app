import {bkRequest} from '@/api/api'

export const hookListDiscounts = async callback => {
    await bkRequest
        .get('/admin/discount')
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookListDiscount: ' + error.message),
        )
}


export const hookAddDiscount = async (data, callback) => {
    await bkRequest
        .post('/admin/discount', data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'کد تخفیف با موفقیت ثبت شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookAddDiscount: ' + error.message))
}


export const hookDeleteDiscount = async (data, callback) => {
    await bkRequest
        .delete(`/admin/discount/${data}`)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'کد تخفیف با موفقیت حذف شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookDeleteDiscount: ' + error.message))
}

export const hookGetDiscount = async (data, callback) => {
    await bkRequest
        .get(`/admin/discount/${data}`)
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookGetFaq: ' + error.message))
}

export const hookUpdateDiscount = async (data, id, callback) => {
    await bkRequest
        .put(`/admin/discount/${id}`, data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'کد تخفیف با موفقیت ویرایش شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookUpdateDiscount: ' + error.message))
}
