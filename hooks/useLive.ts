import axios from 'config/axios'
import { ILive } from 'models/Live'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'

interface UseLiveReturnType {
  live?: ILive | null
  getLive: () => Promise<void>
}

const useLive = (): UseLiveReturnType => {
  const user = useRecoilValue(userState)
  const [live, setLive] = React.useState<ILive | undefined | null>(undefined)

  const getLive = React.useCallback(async () => {
    if (!user) return
    try {
      const response = await axios.get('/api/live')
      if (response.status === 204) {
        return null
      }
      setLive(response.data)
      return response.data
    } catch (error) {
      console.error(error)
      return null
    }
  }, [user])

  React.useEffect(() => {
    getLive().then(setLive)
  }, [getLive])

  return { live, getLive }
}

export default useLive
