import {bkRequest} from '@/api/api'

export const hookSendSms = async (data, callback) => {
  await bkRequest
    .post('/user/sms', data)
    .then(res => {
      if (res.status === 200) {
        if (res.data.status) {
          callback(true, res.data)
        } else {
          callback(false, res.data)
        }
      } else {
        callback(false, 'خطایی در ارسال پیامک به وجود آمد.')
      }
    })
    .catch(error => console.log('error in hookSendSms: ' + error.message))
}
