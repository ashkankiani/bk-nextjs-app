import axios from 'axios'
import QS from 'qs'
import { TypeHeaders } from '@/types/typeConfig'

export type TypeRequestMethod = 'bodyData' | 'queryString' | 'GET' | 'POST'

interface CallExternalApiOptions {
  method?: TypeRequestMethod
  url: string
  data?: object | string
  headers?: TypeHeaders
}

interface CallExternalApiSuccess<T> {
  status: true
  data: T
}

interface CallExternalApiError {
  status: false
  errorMessage: string
}

export async function callExternalApi<T = unknown>({
  method = 'bodyData',
  url,
  data = {},
  headers = {},
}: CallExternalApiOptions): Promise<CallExternalApiSuccess<T> | CallExternalApiError> {
  try {
    let response

    if (method === 'GET') {
      const queryString = QS.stringify(data)
      response = await axios.get(`${url}?${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      })
    } else if (method === 'queryString') {
      const queryString = QS.stringify(data)
      response = await axios.post(
        `${url}?${queryString}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        }
      )
    } else {
      response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      })
    }

    return {
      status: true,
      data: response.data,
    }
  } catch (error: unknown) {
    console.log(error)
    return {
      status: false,
      errorMessage: axios.isAxiosError(error) ? error.message : 'Unknown Error',
    }
  }
}
