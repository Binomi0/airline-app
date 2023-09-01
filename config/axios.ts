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
  async function (response) {
    if (response.status === 401) {
      console.log('BORRANDO SESSION POR CADUCIDAD')
      deleteCookie('token')
      // window.location.reload()
      // await window.Notification.requestPermission()
    }
    return response
  },
  function (err) {
    return Promise.reject(err)
  }
)

export default axios
