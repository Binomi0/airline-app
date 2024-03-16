import axios from 'axios'

export const ivaoInstance = axios.create({ baseURL: 'https://api.ivao.aero/' })

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
    return response
  },
  function (err) {
    return Promise.reject(err)
  }
)

export default axios
