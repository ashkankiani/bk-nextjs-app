import {bkRequest} from '@/api/api'

export const hookAddTimeSheet = async (data, callback) => {
    await bkRequest
        .post('/admin/provider/timesheet', data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'برنامه زمانی با موفقیت ثبت شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookAddTimeSheet: ' + error.message))
}

//
// export const hookDeleteTimeSheet = async (data, callback) => {
//     await bkRequest
//         .delete(`/admin/timesheet/${data}`)
//         .then(res => {
//             if (res.status === 200) {
//                 callback(true, 'برنامه زمانی با موفقیت حذف شد.')
//             } else {
//                 callback(false, res.data.error)
//             }
//         })
//         .catch(error => console.log('error in hookDeleteTimeSheet: ' + error.message))
// }
//
// export const hookGetTimeSheet = async (data, callback) => {
//     await bkRequest
//         .get(`/admin/timesheet/${data}`)
//         .then(res => {
//             if (res.status === 200) {
//                 callback(true, res.data)
//             } else {
//                 callback(false, res.data.error)
//             }
//         })
//         .catch(error => console.log('error in hookGetTimeSheet: ' + error.message))
// }
//
// export const hookGetTimeSheetWhere = async (data, callback) => {
//     await bkRequest
//         .post('/admin/timesheet', data)
//         .then(res => {
//             if (res.status === 200) {
//                 callback(true, res.data)
//             } else {
//                 callback(false, res.data.error)
//             }
//         })
//         .catch(error => console.log('error in hookGetTimeSheetWhere: ' + error.message))
// }
//
// export const hookUpdateTimeSheet = async (data, id, callback) => {
//     await bkRequest
//         .put(`/admin/timesheet/${id}`, data)
//         .then(res => {
//             if (res.status === 200) {
//                 callback(true, 'برنامه زمانی با موفقیت ویرایش شد.')
//             } else {
//                 callback(false, res.data.error)
//             }
//         })
//         .catch(error => console.log('error in hookUpdateTimeSheet: ' + error.message))
// }
