import axios, { AxiosResponse } from 'axios'
import { bkToast } from '@/libs/utility'

export const bkRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API,
  timeout: 16000,
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
})
export const bkRequestZarinpal = axios.create({
  baseURL: 'https://api.zarinpal.com/pg/v4/payment',
  timeout: 16000,
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
})
export const bkRequestIdPay = axios.create({
  baseURL: 'https://api.idpay.ir/v1.1',
  timeout: 16000,
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
})
export const bkRequestAqayePardakht = axios.create({
  baseURL: 'https://panel.aqayepardakht.ir/api/v2',
  timeout: 16000,
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
})
export const bkRequestZibal = axios.create({
  baseURL: 'https://gateway.zibal.ir/v1',
  timeout: 16000,
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
})

bkRequest.interceptors.response.use(
  (res: AxiosResponse) => {
    return res
  },
  error => {
    bkToast('error', 'ارتباط شما با شبکه اینترنت یا سرور برقتو قطع شده است.')
    return Promise.reject(error)
  }
)

// appRequest.interceptors.response.use(
//     (res: AxiosResponse) => {
//         if (res.config.url !== '/sign-out') {
//             if (res.data.Code === 1051 && res.data.Message === 'Not Authorized!') {
//                 window.location.replace('/forbidden')
//                 return Promise.reject(new Error('Not Authorized!'))
//             } else {
//                 return res
//             }
//         } else {
//             return res
//         }
//     },
//     error => {
//         Toast('error', 'ارتباط شما با شبکه اینترنت یا سرور برقتو قطع شده است.')
//         return Promise.reject(error)
//     },
// )
