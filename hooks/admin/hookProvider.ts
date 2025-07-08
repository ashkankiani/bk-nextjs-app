import {bkRequest} from '@/api/api'
import Qs from "qs";




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

