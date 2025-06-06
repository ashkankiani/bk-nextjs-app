import {bkRequest} from '@/api/api'
import Qs from "qs";
export const hookGetDiscount = async (data, callback) => {
    await bkRequest
      .get('/user/discount?' + Qs.stringify(data))
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookGetDiscount: ' + error.message))
}