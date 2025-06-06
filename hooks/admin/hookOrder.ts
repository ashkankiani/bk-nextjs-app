import {bkRequest} from '@/api/api'

export const hookListOrders = async callback => {
  await bkRequest
    .get('/admin/order')
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookListOrders: ' + error.message),)
}
/*

export const hookAddOrder = async (data, callback) => {
  await bkRequest
    .post('/admin/order', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookAddOrder: ' + error.message))
}

export const hookDeleteOrder = async (data, callback) => {
  await bkRequest
    .delete(`/admin/order/${data}`)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'سفارش با موفقیت حذف شد.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookDeleteOrder: ' + error.message))
}

export const hookGetOrder = async (data, callback) => {
  await bkRequest
    .get(`/admin/order/${data}`)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetOrder: ' + error.message))
}

export const hookGetOrderWhere = async (data, callback) => {
  await bkRequest
    .post('/admin/order', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetOrderWhere: ' + error.message))
}

export const hookUpdateOrder = async (data, id, callback) => {
  await bkRequest
    .put(`/admin/order/${id}`, data)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'سفارش با موفقیت ویرایش شد.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookUpdateOrder: ' + error.message))
}*/
