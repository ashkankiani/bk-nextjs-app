import {bkRequest} from '@/api/api'

export const hookGetDraftWhere = async (data, callback) => {
  await bkRequest
    .post('/user/draft', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetDraftWhere: ' + error.message))
}

export const hookAddDraftReservation = async (data, callback) => {
  await bkRequest
    .post('/user/draft', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else if (res.status === 201) {
        callback(false, res.data.error)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookAddDraftReservation: ' + error.message))
}