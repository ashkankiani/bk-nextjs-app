import {bkRequest} from '@/api/api'

export const hookRegister = async (data, callback) => {
  await bkRequest
    .post(`/user/auth/${data.codeMeli}`, data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data.error)
      } else if (res.status === 201) {
        callback(false, res.data.error)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookRegister: ' + error.message))
}

export const hookLogin = async (data, callback) => {
  await bkRequest
    .post(`/user/auth/${data.type}`, data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else if (res.status === 201) {
        callback(false, res.data.error)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookLogin: ' + error.message))
}

// export const hookUpdateUser = async (data, callback) => {
//   await bkRequest
//     .post(`/user/auth/${data.codeMeli}`, data)
//     .then(res => {
//       if (
//         res.status === 200
//       ) {
//         callback(true, res.data)
//       } else {
//         callback(false, res.data.error)
//       }
//     })
//     .catch(error => console.log('error in hookUpdateUser: ' + error.message))
// }

// export const hookResetPasswordUser = async (data, callback) => {
//   await bkRequest
//     .post(`/user/auth/${data.mobile}`, data)
//     .then(res => {
//       if (
//         res.status === 200
//       ) {
//         callback(true, res.data)
//       } else {
//         callback(false, res.data.error)
//       }
//     })
//     .catch(error => console.log('error in hookResetPasswordUser: ' + error.message))
// }
