import axios from 'config/axios'
import { ILive } from 'models/Live'
import React from 'react'

interface UseLiveReturnType {
  live: ILive | null
}

const useLive = (): UseLiveReturnType => {
  const [live, setLive] = React.useState<ILive | null>(null)

  const getLive = React.useCallback(async () => {
    try {
      const response = await axios.get('/api/live')
      return response.data
    } catch (error) {
      console.error(error)
      return null
    }
  }, [])

  React.useEffect(() => {
    getLive().then(setLive)
  }, [getLive])

  return { live }
}

export default useLive
