import axios from 'config/axios'
import { ILive } from 'models/Live'
import React from 'react'
import useAuth from './useAuth'

interface UseLiveReturnType {
  live?: ILive | null
}

const useLive = (): UseLiveReturnType => {
  const { user } = useAuth()
  const [live, setLive] = React.useState<ILive | undefined | null>()

  const getLive = React.useCallback(async () => {
    if (!user) return
    try {
      const response = await axios.get('/api/live')
      if (response.status === 204) {
        return null
      }
      return response.data
    } catch (error) {
      console.error(error)
      return null
    }
  }, [user])

  React.useEffect(() => {
    getLive().then(setLive)
  }, [getLive])

  return { live }
}

export default useLive
