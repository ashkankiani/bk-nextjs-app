import {bkRequest} from '@/api/api'
import {AxiosResponse} from "axios";

type PermissionCallback = (success: boolean, data?: Permissions | string) => void;
export const hookGetPermission = async (
    catalogId: number,
    callback: PermissionCallback
): Promise<void> => {
    try {
        const res: AxiosResponse<Permissions> = await bkRequest.get(`/user/permission/${catalogId}`);
        if (res.status === 200) {
            callback(true, res.data);
        } else {
            callback(false, 'خطا در دریافت مجوزها');
        }
    } catch (error) {
        console.error('خطا در hookGetPermission:', error);
        callback(false, 'خطا در اتصال به سرور');
    }
};

export const hookGetPermissionWhere = async (data, callback) => {
  await bkRequest
    .post('/admin/permission', data)
    .then(res => {
      if (res.status === 200) {
        callback(true, res.data)
      } else {
        callback(false, res.data.error)
      }
    })
    .catch(error => console.log('error in hookGetPermissionWhere: ' + error.message))
}


export const hookUpdatePermission = async (data, id, callback) => {
    await bkRequest
        .put(`/admin/permission/${id}`, data)
        .then(res => {
            if (res.status === 200) {
                callback(true, 'مجوز با موفقیت ویرایش شد.')
            } else {
                callback(false, res.data.error)
            }
        })
        .catch(error => console.log('error in hookUpdatePermission: ' + error.message))
}


