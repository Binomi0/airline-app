import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Mission, PublicMission } from 'types'
import { missionStore } from 'store/mission.atom'
import nextApiInstance from 'config/axios'
import { INft } from 'models/Nft'

interface UseMission {
  reserveMission: (missionId: string, aircraft: INft) => Promise<Mission>
  getMission: () => Promise<void>
  getPool: () => Promise<PublicMission[]>
  setMission: (mission?: Mission) => void
  mission?: Mission
  pool: PublicMission[]
  isLoading: boolean
  completed: number
}

const useMission = (): UseMission => {
  const [mission, setMission] = useRecoilState(missionStore)
  const [pool, setPool] = useState<PublicMission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [completed, setCompleted] = useState(0)

  const getMission = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await nextApiInstance.get<Mission>('/api/missions/current') // Assuming we move it to /current or similar
      setMission(response.data)
    } catch (error) {
      console.error('getMission error =>', error)
    } finally {
      setIsLoading(false)
    }
  }, [setMission])

  const getPool = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await nextApiInstance.get<PublicMission[]>('/api/missions')
      setPool(response.data)
      return response.data
    } catch (error) {
      console.error('getPool error =>', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reserveMission = useCallback(
    async (missionId: string, aircraft: INft) => {
      setIsLoading(true)
      try {
        const { data: userMission } = await nextApiInstance.post<Mission>('/api/missions/reserve', {
          missionId,
          aircraftId: aircraft.id.toString()
        })

        setMission(userMission)
        return userMission
      } catch (err) {
        console.error('reserveMission error =>', err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [setMission]
  )

  const getCompletedCount = useCallback(async () => {
    try {
      const { data } = await nextApiInstance.get<{ count: number }>('/api/missions/count')
      setCompleted(data.count)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    getCompletedCount()
  }, [getCompletedCount])

  return { reserveMission, mission, pool, getMission, getPool, setMission, isLoading, completed }
}

export default useMission
