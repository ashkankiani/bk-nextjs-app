import {bkRequest} from '@/api/api'
export const hookGetTimeSheetWhere = async (data, callback) => {
  await bkRequest
    .post('/user/timesheet', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetTimeSheetWhere: ' + error.message))
}