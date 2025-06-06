import {bkRequest} from '@/api/api'
export const hookListHolidays = async callback => {
  await bkRequest
    .get('/user/holiday')
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookListHoliday: ' + error.message),)
}