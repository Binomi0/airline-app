import axios from 'config/axios'
import { ILive } from 'models/Live'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { liveStore } from 'store/live.atom'
import { userState } from 'store/user.atom'

interface UseLiveReturnType {
  live?: ILive | null
  getLive: () => Promise<void>
}

const useLive = (): UseLiveReturnType => {
  const user = useRecoilValue(userState)
  const [live, setLive] = useRecoilState(liveStore)

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
  }, [setLive, user])

  React.useEffect(() => {
    getLive().then(setLive)
  }, [getLive, setLive])

  return { live, getLive }
}

export default useLive
