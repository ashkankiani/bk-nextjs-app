import {bkRequest} from '@/api/api'
import Qs from "qs";

export const hookListUsers = async callback => {
  await bkRequest
    .get('/admin/user')
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error =>
      console.log('error in hookListUsers: ' + error.message),
    )
}

export const hookAddUser = async (data, callback) => {
  await bkRequest
    .post('/admin/user', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'کاربر با موفقیت ثبت شد.')
      } else if (res.status === 201) {
        callback(false, res.data.error)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookAddUser: ' + error.message))
}

export const hookDeleteUser = async (data, callback) => {
  await bkRequest
    .delete(`/admin/user/${data}`)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'کاربر با موفقیت حذف شد.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookDeleteUser: ' + error.message))
}

export const hookGetUser = async (data, callback) => {
  await bkRequest
    .get(`/admin/user/${data}`)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetUser: ' + error.message))
}

export const hookListUsersWhere = async (data, callback) => {
  await bkRequest
    .post('/admin/user', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookListUsersWhere: ' + error.message))
}

export const hookListUsersByCatalogId = async (data,callback) => {
  await bkRequest
    .get('/admin/user?' + Qs.stringify(data))
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookListUsersByCatalogId: ' + error.message))
}

export const hookUpdateUser = async (data, id, callback) => {
  await bkRequest
    .put(`/admin/user/${id}`, data)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'کاربر با موفقیت ویرایش شد.')
      } else if (res.status === 201) {
        callback(false, res.data.error)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookUpdateUser: ' + error.message))
}

export const hookImportUser = async (data, callback) => {
  await bkRequest
    .post('/admin/user/importUser', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else if (res.status === 201) {
        callback(false, res.data.error)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookImportUser: ' + error.message))
}