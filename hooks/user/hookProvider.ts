import { bkRequest } from '@/api/api'
import Qs from 'qs'

export const hookGetProviders = async (data, callback) => {
  await bkRequest
    .get('/user/provider?' + Qs.stringify(data))
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetProviders: ' + error.message))
}
