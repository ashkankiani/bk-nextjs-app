import {bkRequest} from '@/api/api'
import {AppHeader} from "@/libs/utility";

export const hookListServices = async callback => {
    await bkRequest
        .get('/admin/service', AppHeader())
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error =>
            console.log('error in hookListServices: ' + error.message),
        )
}


export const hookAddService = async (data, callback) => {
    await bkRequest
        .post('/admin/service', data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'خدمت با موفقیت ثبت شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookAddService: ' + error.message))
}

export const hookGetService = async (data, callback) => {
    await bkRequest
        .get(`/admin/service/${data}`)
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookGetService: ' + error.message))
}

export const hookListServicesWhere = async (data, callback) => {
    await bkRequest
        .post('/admin/service', data)
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookListServicesWhere: ' + error.message))
}


export const hookUpdateService = async (data, id, callback) => {
    await bkRequest
        .put(`/admin/service/${id}`, data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'خدمت با موفقیت ویرایش شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookUpdateService: ' + error.message))
}


export const hookDeleteService = async (data, callback) => {
  await bkRequest
    .delete(`/admin/service/${data}`)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'خدمت با موفقیت حذف شد.')
      }else if (res.status === 201) {
        callback(false, res.data.error)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookDeleteService: ' + error.message))
}