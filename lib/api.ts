import { AxiosError } from 'axios'
import axios from 'config/axios'

const fetcher = async <T, P = any, B = any>(
  url: string,
  method: 'POST' | 'GET' | 'DELETE',
  params?: P,
  data?: B
): Promise<T | undefined> => {
  try {
    const response = await axios<T>(url, { method, ...(params ? { params } : {}), ...(data ? { data } : {}) })

    return response.data
  } catch (err) {
    const error = err as AxiosError
    console.error('Fetching data', error.response?.data)
    return undefined
  }
}

export const getApi = async <T, P = any>(url: string, params?: P) => fetcher<T, P>(url, 'GET', params)
export const postApi = async <T, B = any, P = any>(url: string, body?: B, params?: P) =>
  fetcher<T, any, B>(url, 'POST', params, body)
export const deleteApi = async (url: string) => fetcher(url, 'DELETE')
