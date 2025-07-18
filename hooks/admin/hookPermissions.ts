import { bkRequest } from '@/api/api'
import { AxiosResponse } from 'axios'

type PermissionCallback = (success: boolean, data?: Permissions | string) => void
export const hookGetPermission = async (
  catalogId: number,
  callback: PermissionCallback
): Promise<void> => {
  try {
    const res: AxiosResponse<Permissions> = await bkRequest.get(`/user/permission/${catalogId}`)
    if (res.status === 200) {
      callback(true, res.data)
    } else {
      callback(false, 'خطا در دریافت مجوزها')
    }
  } catch (error) {
    console.error('خطا در hookGetPermission:', error)
    callback(false, 'خطا در اتصال به سرور')
  }
}
