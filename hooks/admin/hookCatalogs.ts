import {bkRequest} from '@/api/api'

export const hookListCatalogs = async callback => {
    await bkRequest
        .get('/admin/catalog')
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error =>
            console.log('error in hookListCatalogs: ' + error.message),
        )
}

export const hookAddCatalog = async (data, callback) => {
    await bkRequest
        .post('/admin/catalog', data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'سطوح دسترسی با موفقیت ثبت شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookAddCatalog: ' + error.message))
}

export const hookDeleteCatalog = async (data, callback) => {
    await bkRequest
        .delete(`/admin/catalog/${data}`)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'سطوح دسترسی با موفقیت حذف شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookDeleteCatalog: ' + error.message))
}