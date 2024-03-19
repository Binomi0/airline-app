import axios from 'axios'

onmessage = async function (e) {
  const token = e.data[0]
  if (!token) {
    postMessage('UnAuthorized request')
  } else {
    try {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      const response = await axios.get('/api/ivao/pilots')

      console.log('RESPONSE =>', response.data)
      postMessage([null, response.data])
    } catch (response) {
      console.log('ERROR =>', response)
      postMessage(['error'])
    }
  }
}
