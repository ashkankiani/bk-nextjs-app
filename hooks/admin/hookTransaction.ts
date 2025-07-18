import { bkRequest } from '@/api/api'

export const hookDeleteTransaction = async (data, callback) => {
  await bkRequest
    .delete(`/admin/transaction/${data}`)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'رزرو  + سند پرداخت + تراکنش با موفقیت حذف شد.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookDeleteTransaction: ' + error.message))
}

// export const hookListTransactions = async callback => {
//     await bkRequest
//         .get('/admin/transaction')
//         .then(res => {
//             if (res.status === 200) {
//                 callback(true, res.data)
//             } else {
//                 callback(false, res.data.error)
//             }
//         })
//         .catch(error =>
//             console.log('error in hookListTransactions: ' + error.message),
//         )
// }
//
// export const hookAddTransaction = async (data, callback) => {
//     await bkRequest
//         .post('/admin/transaction', data)
//         .then(res => {
//             if (res.status === 200) {
//                 callback(true, 'تراکنش با موفقیت ثبت شد.')
//             } else {
//                 callback(false, res.data.error)
//             }
//         })
//         .catch(error => console.log('error in hookAddTransaction: ' + error.message))
// }

// export const hookGetTransaction = async (data, callback) => {
//     await bkRequest
//         .get(`/admin/transaction/${data}`)
//         .then(res => {
//             if (res.status === 200) {
//                 callback(true, res.data)
//             } else {
//                 callback(false, res.data.error)
//             }
//         })
//         .catch(error => console.log('error in hookGetTransaction: ' + error.message))
// }
//
// export const hookUpdateTransaction = async (data, id, callback) => {
//     await bkRequest
//         .put(`/admin/transaction/${id}`, data)
//         .then(res => {
//             if (res.status === 200) {
//                 callback(true, 'تراکنش با موفقیت ویرایش شد.')
//             } else {
//                 callback(false, res.data.error)
//             }
//         })
//         .catch(error => console.log('error in hookUpdateTransaction: ' + error.message))
// }
