import {bkRequest} from '@/api/api'

export const hookListDraft = async callback => {
  await bkRequest
    .get('/admin/draft')
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

export const hookDeleteAllDraft = async (callback) => {
  await bkRequest
    .delete('/admin/draft')
    .then(res => {
      if (res.status === 200) {
        callback(true, 'همه در حال رزروها با موفقیت حذف شدند.')
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookDeleteAllDraft: ' + error.message))
}