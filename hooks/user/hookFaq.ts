import { bkRequest } from '@/api/api'

export const hookListFaqs = async callback => {
  await bkRequest
    .get('/user/faq')
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookListFaqs: ' + error.message))
}
