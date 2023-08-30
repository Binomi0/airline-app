import axios from 'axios'
import { deleteCookie } from 'cookies-next'

axios.interceptors.request.use(
  function (config) {
    return config
  },
  function (err) {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  function (response) {
    if (response.status === 401) {
      deleteCookie('token')
      window.location.reload()
    }
    return response
  },
  function (err) {
    return Promise.reject(err)
  }
)

export default axios
