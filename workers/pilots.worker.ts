import axios from 'axios'

onmessage = async function (e) {
  const [token] = e.data
  if (!token) {
    postMessage('UnAuthorized request')
  } else {
    axios
      .get('/api/ivao/pilots')
      .then((response) => {
        postMessage([response.data])
      })
      .catch((err) => {
        console.log('ERROR =>', err.response.data)
        throw new Error(err.response.data)
      })
  }
}

onerror = function (e) {
  console.log('Error in worker', e)
}
