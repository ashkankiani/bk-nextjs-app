import {bkRequest} from '@/api/api'

export const hookListServices = async callback => {
    await bkRequest
        .get('/user/service')
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error =>
            console.log('error in hookListServices: ' + error.message),
        )
}
