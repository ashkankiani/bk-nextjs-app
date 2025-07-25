import {
  bkRequestAqayePardakht,
  bkRequestIdPay,
  bkRequestZarinpal,
  bkRequestZibal,
} from '@/api/api'
import Qs from 'qs'

export const hookZarinpalGetAuthority = async (data, callback) => {
  await bkRequestZarinpal
    .post('/request.json', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data.data)
      } else {
        callback(false, res.data.errors)
      }
    })
    .catch(error => console.log('error in hookZarinpalGetAuthority: ' + error.message))
}

export const hookZarinpalGetVerify = async (data, callback) => {
  await bkRequestZarinpal
    .post('/verify.json', data)
    .then(res => {
      if (
        (res.status === 200 && res.data.data.code === 100) ||
        (res.status === 200 && res.data.data.code === 101)
      ) {
        callback(true, res.data.data)
      } else {
        callback(false, res.data.errors)
      }
    })
    .catch(error => console.log('error in hookZarinpalGetVerify: ' + error.message))
}

export const hookIdPayGetAuthority = async (data, token, callback) => {
  await bkRequestIdPay
    .post('/payment', data, {
      headers: Qs.parse({
        'X-API-KEY': token,
      }),
    })
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else if (res.status === 406) {
        callback(false, res.data.error_code + ': ' + res.data.error_message)
      } else {
        callback(false, 'خطا در اتصال به درگاه')
      }
    })
    .catch(error => console.log('error in hookIdPayGetAuthority: ' + error.message))
}

export const hookIdPayGetVerify = async (data, callback) => {
  await bkRequestZarinpal
    .post('/verify.json', data)
    .then(res => {
      if (
        (res.status === 200 && res.data.data.code === 100) ||
        (res.status === 200 && res.data.data.code === 101)
      ) {
        callback(true, res.data.data)
      } else {
        callback(false, res.data.errors)
      }
    })
    .catch(error => console.log('error in hookZarinpalGetVerify: ' + error.message))
}

export const hookAqayePardakhtGetAuthority = async (data, callback) => {
  await bkRequestAqayePardakht
    .post('/create', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else if (res.status === 422) {
        callback(false, res.data.status + ': کد خطا ' + res.data.code)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookAqayePardakhtGetAuthority: ' + error.message))
}

export const hookAqayePardakhtGetVerify = async (data, callback) => {
  await bkRequestAqayePardakht
    .post('/verify', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data.data)
      } else {
        callback(false, res.data)
      }
    })
    .catch(error => {
      callback(false, error.response.data)
      console.log('error in hookAqayePardakhtGetVerify: ' + error.response.data.code)
    })
}

export const hookZibalGetAuthority = async (data, callback) => {
  await bkRequestZibal
    .post('/request', data)
    .then(res => {
      if (res.status === 200 && res.data.result === 100) {
        callback(true, res.data)
      } else {
        callback(false, res.data)
      }
    })
    .catch(error => console.log('error in hookZibalGetAuthority: ' + error.message))
}

export const hookZibalGetVerify = async (data, callback) => {
  await bkRequestZibal
    .post('/verify', data)
    .then(res => {
      if (
        (res.status === 200 && res.data.result === 100) ||
        (res.status === 200 && res.data.result === 201)
      ) {
        callback(true, res.data)
      } else {
        callback(false, res.data)
      }
    })
    .catch(error => console.log('error in hookZibalGetVerify: ' + error.message))
}
