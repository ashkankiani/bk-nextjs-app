import {bkRequest} from '@/api/api'

export const hookGetReservationWhere = async (data, callback) => {
  await bkRequest
    .post('/user/reservation', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetReservationWhere: ' + error.message))
}

export const hookAddReservation = async (data, callback) => {
  await bkRequest
    .post('/user/reservation/add', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookAddReservation: ' + error.message))
}

export const hookCancelReservation = async (data, callback) => {
  await bkRequest
    .put('/user/reservation', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'درخواست لغو رزرو با موفقیت انجام شد. پیامک اطلاع رسانی ارسال شد.')
      } else if (res.status === 201) {
        callback(true, 'درخواست لغو رزرو با موفقیت انجام شد. پیامک اطلاع رسانی غیرفعال است.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookCancelReservation: ' + error.message))
}