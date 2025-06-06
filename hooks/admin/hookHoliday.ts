import {bkRequest} from '@/api/api'

export const hookListHolidays = async callback => {
  await bkRequest
    .get('/admin/holiday')
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookListHoliday: ' + error.message),)
}


export const hookAddHoliday = async (data, callback) => {
  await bkRequest
    .post('/admin/holiday', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'روز تعطیل با موفقیت ثبت شد.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookAddHoliday: ' + error.message))
}


export const hookGetHoliday = async (data, callback) => {
  await bkRequest
    .get(`/admin/holiday/${data}`)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetFaq: ' + error.message))
}

export const hookUpdateHoliday = async (data, id, callback) => {
  await bkRequest
    .put(`/admin/holiday/${id}`, data)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'روز تعطیل با موفقیت ویرایش شد.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookUpdateHoliday: ' + error.message))
}


export const hookDeleteHoliday = async (data, callback) => {
  await bkRequest
    .delete(`/admin/holiday/${data}`)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'روز تعطیل با موفقیت حذف شد.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookDeleteHoliday: ' + error.message))
}