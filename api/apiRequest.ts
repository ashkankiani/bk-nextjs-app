import Qs from 'qs'
import {AxiosResponse} from 'axios'
import {AppHeader} from '@/libs/utility'
import {bkRequest} from "@/api/api";
import {TypeApiCustomError} from "@/types/typeConfig";

/*<====================================>*/
// Helper functions
/*<====================================>*/
export const checkRequestGet = <T>(response: AxiosResponse): T => {
    if (response.status === 200) {
        if (response.data.Success) {
            return response.data.Data as T
        } else {
            const error: TypeApiCustomError = new Error(response.data.Message) as TypeApiCustomError
            error.Code = response.data.Code
            error.Reason = response.data.Message
            error.Details = response.data.Details
            throw error
        }
    } else {
        const error: TypeApiCustomError = new Error(response.data.error) as TypeApiCustomError
        error.Code = response.data.Code
        error.Reason = response.data.error
        throw error
    }
}

export const checkRequestPost = <T>(response: AxiosResponse): T => {
    if (response.status === 200) {
        if (response.data.Success) {
            return response.data.Data as T
        } else {
            const error: TypeApiCustomError = new Error(response.data.Message) as TypeApiCustomError
            error.Code = response.data.Code
            error.Reason = response.data.Message
            error.Details = response.data.Details
            throw error
        }
    } else {
        const error: TypeApiCustomError = new Error(response.data.error) as TypeApiCustomError
        error.Code = response.data.Code
        error.Reason = response.data.error
        throw error
    }
}

// export const checkRequestFile = <T>(response: AxiosResponse): T => {
//   if (response.status === 200) {
//     return response as T
//   } else {
//     const error: TypeApiCustomError = new Error('Invalid file') as TypeApiCustomError
//     error.code = response.data.Code
//     error.reason = response.data.Message
//     throw error
//   }
// }

/*<====================================>*/
// API Requests
/*<====================================>*/

// Generic GET request
export const getRequest = async <T>(url: string, params?: object): Promise<T> => {
    const response = await bkRequest.get(url + Qs.stringify(params, {allowDots: true}), AppHeader())
    return checkRequestGet<T>(response)
}

// Generic POST request
export const postRequest = async <T>(url: string, params: object): Promise<T> => {
    const response = await bkRequest.post(url, params, AppHeader())
    return checkRequestPost<T>(response)
}

// Generic GET request with file
// export const getRequestWithFile = async <T>(url: string, params: object): Promise<T> => {
//   const response = await appRequestFile.get(url + Qs.stringify(params, { allowDots: true }), AppHeader())
//   return checkRequestFile<T>(response)
// }

// Generic POST request with file
// export const postRequestWithFile = async <T>(url: string, params: object, files: TypeFormData): Promise<T> => {
//   const response = await appRequest.post(url + Qs.stringify(params), files, AppHeaderFile())
//   return checkRequestPost<T>(response)
// }

// Generic Delete request
export const deleteRequest = async <T>(url: string, params: object): Promise<T> => {
    const response = await bkRequest.delete(url + Qs.stringify(params), AppHeader())
    return checkRequestPost<T>(response)
}

// Generic POST request
export const putRequest = async <T>(url: string, params: object): Promise<T> => {
    const response = await bkRequest.put(url, params, AppHeader())
    return checkRequestPost<T>(response)
}
