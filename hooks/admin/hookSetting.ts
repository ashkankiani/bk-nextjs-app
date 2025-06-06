import {bkRequest} from '@/api/api'

export const hookGetSettings = async callback => {
    await bkRequest
        .get('/admin/setting')
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data[0])
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error =>
            console.log('error in hookGetSettings: ' + error.message),
        )
}

export const hookUpdateSettings = async (data, callback) => {
    await bkRequest
        .put('/admin/setting', data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'تنظیمات با موفقیت بروزرسانی شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookUpdateSettings: ' + error.message))
}
