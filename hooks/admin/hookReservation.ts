import {bkRequest} from '@/api/api'

export const hookListReservations = async callback => {
  await bkRequest
    .get('/admin/reservation')
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error =>
      console.log('error in hookListReservations: ' + error.message),
    )
}

export const hookAddReservation = async (data, callback) => {
  await bkRequest
    .post('/admin/reservation', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookAddReservation: ' + error.message))
}

export const hookEditReservation = async (data, callback) => {
  await bkRequest
    .put('/admin/reservation/editReserve', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookEditReservation: ' + error.message))
}

export const hookDeleteReservation = async (data, callback) => {
  await bkRequest
    .delete(`/admin/reservation/${data}`)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data.message)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookDeleteReservation: ' + error.message))
}

export const hookDeleteAllReservationUser = async (data, callback) => {
  await bkRequest
    .post(`/admin/reservation/${data}`, data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data.message)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookDeleteAllReservationUser: ' + error.message))
}

export const hookGetReservationWhere = async (data, callback) => {
  await bkRequest
    .post('/admin/reservation', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetReservationWhere: ' + error.message))
}

// export const hookDeleteReservationUser = async (data, callback) => {
//   await bkRequest
//     .delete(`/admin/reservation/user/${data}`)
//     .then(res => {
//       if (res.status === 200) {
//         callback(true, 'رزروهای کاربر با موفقیت حذف شدند.')
//       } else {
//         callback(false, res.data.error)
//       }
//     })
//     .catch(error => console.log('error in hookDeleteReservationUser: ' + error.message))
// }

export const hookChangeReservation = async (data, callback) => {
  await bkRequest
    .put('/admin/reservation/changeStatusReserve', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'درخواست تغییر وضعیت رزرو با موفقیت انجام شد. پیامک/ایمیل ارسال شد.')
      } else if (res.status === 201) {
        callback(true, 'درخواست تغییر وضعیت رزرو با موفقیت انجام شد.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookChangeReservation: ' + error.message))
}

export const hookReminderReservation = async (data, callback) => {
  await bkRequest
    .post('/admin/reservation/reminderReserve', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'درخواست یادآوری رزرو با موفقیت ارسال شد.')
      } else if (res.status === 201) {
        callback(true, 'پیامک یادآوری ارسال شده ولی باید بررسی کنم این وضعیت رو.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookReminderReservation: ' + error.message))
}

export const hookAppreciationReservation = async (data, callback) => {
  await bkRequest
    .post('/admin/reservation/appreciationReserve', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'درخواست قدردانی رزرو با موفقیت ارسال شد.')
      } else if (res.status === 201) {
        callback(true, 'پیامک یادآوری ارسال شده ولی باید بررسی کنم این وضعیت رو.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookAppreciationReservation: ' + error.message))
}

export const hookIsReservation = async (data, callback) => {
  await bkRequest
    .post('/admin/reservation/isReservation', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      }else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookIsReservation: ' + error.message))
}