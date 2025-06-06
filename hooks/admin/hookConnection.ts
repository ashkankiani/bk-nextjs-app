import {bkRequest} from '@/api/api'

export const hookGetConnections = async callback => {
    await bkRequest
        .get('/admin/connection')
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data[0])
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookGetConnections: ' + error.message),
        )
}

export const hookUpdateConnections = async (data, callback) => {
    await bkRequest
        .put('/admin/connection', data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'ارتباطات با موفقیت بروزرسانی شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookUpdateConnections: ' + error.message))
}
