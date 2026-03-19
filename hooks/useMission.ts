import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Mission, MissionStatus, FRoute, MissionType, MissionCategory } from 'types'
import { getMissionWeight, getRandomInt, getMissionPrize } from 'utils'
import { missionStore } from 'store/mission.atom'
import { cargos } from 'mocks/cargos'
import nextApiInstance from 'config/axios'
import { INft } from 'models/Nft'

interface UseMission {
  newMission: (route: FRoute, owned: INft, callsign: string, remote: boolean) => Promise<void>
  getMission: () => Promise<void>
  setMission: (mission?: Mission) => void
  mission?: Mission
  isLoading: boolean
  completed: number
}

const useMission = (): UseMission => {
  const [mission, setMission] = useRecoilState(missionStore)
  const [isLoading, setIsLoading] = useState(false)
  const [completed, setCompleted] = useState(0)

  const getMission = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await nextApiInstance.get<Mission>('/api/missions')
      setMission(response.data)
    } catch (error) {
      console.error('error =>', error)
    } finally {
      setIsLoading(false)
    }
  }, [setMission])

  const newMission = useCallback(
    async (route: FRoute, aircraft: INft, callsign: string, remote: boolean) => {
      try {
        const details = cargos[getRandomInt(8)]
        const weight = getMissionWeight(aircraft)
        const prize = getMissionPrize(route.distance, aircraft)
        const mission: Mission = {
          origin: route.origin,
          destination: route.destination,
          distance: route.distance,
          type: route.type || MissionType.CARGO,
          category: MissionCategory.NORMAL,
          isSponsored: false,
          rewardMultiplier: 1.0,
          details,

          aircraft,
          aircraftId: aircraft.id.toString(),
          weight,
          callsign,
          prize,
          rewards: 0,
          status: MissionStatus.STARTED,
          remote,
          isRewarded: false
        }
        setMission(mission)
      } catch (err) {
        const error = err as Error
        console.error(error)
        throw new Error(error.message)
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

  return { newMission, mission, getMission, setMission, isLoading, completed }
}

export default useMission
