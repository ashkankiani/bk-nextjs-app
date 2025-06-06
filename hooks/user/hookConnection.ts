import {bkRequest} from '@/api/api'

export const hookGetConnections = async callback => {
    await bkRequest
        .get('/user/connection')
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data[0])
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error =>
            console.log('error in hookGetConnections: ' + error.message),
        )
}
