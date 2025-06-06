// import {bkRequest} from '@/libs/api'
// export const hookDeletePayment = async (data, callback) => {
//     await bkRequest
//         .delete(`/admin/payment/${data}`)
//         .then(res => {
//             if (res.status === 200) {
//                 callback(true, 'رزرو  + سند پرداخت با موفقیت حذف شد.')
//             } else {
//                 callback(false, res.data.error)
//             }
//         })
//         .catch(error => console.log('error in hookDeletePayment: ' + error.message))
// }
