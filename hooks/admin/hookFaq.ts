import {bkRequest} from '@/api/api'

export const hookListFaqs = async callback => {
    await bkRequest
        .get('/admin/faq')
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookListFaqs: ' + error.message),
          )
}


export const hookAddFaq = async (data, callback) => {
    await bkRequest
        .post('/admin/faq', data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'سوال متداول با موفقیت ثبت شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookAddFaq: ' + error.message))
}



export const hookGetFaq = async (data, callback) => {
    await bkRequest
        .get(`/admin/faq/${data}`)
        .then(res => {
            if (res.status === 200) {
                callback(true, res.data)
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookGetFaq: ' + error.message))
}

export const hookUpdateFaq = async (data, id, callback) => {
    await bkRequest
        .put(`/admin/faq/${id}`, data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'سوال متداول با موفقیت ویرایش شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookUpdateFaq: ' + error.message))
}

export const hookDeleteFaq = async (data, callback) => {
  await bkRequest
    .delete(`/admin/faq/${data}`)
    .then(res => {
      if (res.status === 200) {
        callback(true, 'سوال متداول با موفقیت حذف شد.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookDeleteFaq: ' + error.message))
}
