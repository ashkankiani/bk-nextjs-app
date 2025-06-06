import {bkRequest} from '@/api/api'

export const hookGetSession = async (data, callback) => {
  await bkRequest
    .get(`/user/session/${data}`)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => {
      console.log('error in hookGetSession: ' + error.message)
      callback(false, false)
    })
}

export const hookDeleteSession = async (callback) => {
  await bkRequest
    .get("/user/session")
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookDeleteSession: ' + error.message))
}
