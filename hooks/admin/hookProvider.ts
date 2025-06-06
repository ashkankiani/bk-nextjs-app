import {bkRequest} from '@/api/api'
import Qs from "qs";

export const hookListProviders = async callback => {
    await bkRequest
        .get('/admin/provider')
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error =>
            console.log('error in hookListProviders: ' + error.message),
        )
}


export const hookAddProvider = async (data, callback) => {
    await bkRequest
        .post('/admin/provider', data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'ارائه دهنده با موفقیت ثبت شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookAddProvider: ' + error.message))
}


export const hookDeleteProvider = async (data, callback) => {
    await bkRequest
        .delete(`/admin/provider/${data}`)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'ارائه دهنده با موفقیت حذف شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookDeleteProvider: ' + error.message))
}

export const hookGetProvider = async (data, callback) => {
    await bkRequest
        .get(`/admin/provider/${data}`)
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookGetProvider: ' + error.message))
}


export const hookGetProviderWhere = async (data, callback) => {
    await bkRequest
        .post('/admin/provider', data)
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookGetProviderWhere: ' + error.message))
}


export const hookGetProviderByKeyId = async (data, callback) => {
  await bkRequest
    .get('/admin/provider?' + Qs.stringify(data))
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetProviderByKeyId: ' + error.message))
}



export const hookGetTimeSheetProvider = async (data, callback) => {
    await bkRequest
        .get(`/admin/provider/timesheet/${data}`)
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookGetTimeSheetProvider: ' + error.message))
}

export const hookDeleteTimeSheetProvider = async (data, callback) => {
    await bkRequest
        .delete(`/admin/provider/timesheet/${data}`)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'برنامه زمانی با موفقیت حذف شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookDeleteTimeSheetProvider: ' + error.message))
}

export const hookUpdateProvider = async (data, id, callback) => {
    await bkRequest
        .put(`/admin/provider/${id}`, data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'ارائه دهنده با موفقیت ویرایش شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookUpdateProvider: ' + error.message))
}
