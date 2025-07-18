import { bkRequest } from '@/api/api'
import Qs from 'qs'
export const hookGetOrder = async (data, callback) => {
  await bkRequest
    .get('/user/order?' + Qs.stringify(data))
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetOrder: ' + error.message))
}
