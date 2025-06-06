import {bkRequest} from '@/api/api'

export const hookSendEmail = async (data, callback) => {
  await bkRequest
    .post('/admin/email', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, 'خطایی در ارسال ایمیل به وجود آمد.')
      }
    })
    .catch(error => console.log('error in hookSendEmail: ' + error.message))
}
