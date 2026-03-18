import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Cargo, CargoStatus, FRoute } from 'types'
import { getCargoWeight, getRandomInt, getCargoPrize } from 'utils'
import { cargoStore } from 'store/cargo.atom'
import { cargos } from 'mocks/cargos'
import nextApiInstance from 'config/axios'
import { INft } from 'models/Nft'

interface UseCargo {
  newCargo: (route: FRoute, owned: INft, callsign: string, remote: boolean) => Promise<void>
  getCargo: () => Promise<void>
  setCargo: (cargo?: Cargo) => void
  cargo?: Cargo
  isLoading: boolean
  completed: number
}

const useCargo = (): UseCargo => {
  const [cargo, setCargo] = useRecoilState(cargoStore)
  const [isLoading, setIsLoading] = useState(false)
  const [completed, setCompleted] = useState(0)

  const getCargo = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await nextApiInstance.get<Cargo>('/api/cargo')
      setCargo(response.data)
    } catch (error) {
      console.error('error =>', error)
    } finally {
      setIsLoading(false)
    }
  }, [setCargo])

  const newCargo = useCallback(
    async (route: FRoute, aircraft: INft, callsign: string, remote: boolean) => {
      try {
        const details = cargos[getRandomInt(8)]
        const weight = getCargoWeight(aircraft)
        const prize = getCargoPrize(route.distance, aircraft)
        const cargo: Cargo = {
          origin: route.origin,
          destination: route.destination,
          distance: route.distance,
          details,
          aircraft,
          aircraftId: aircraft.id.toString(),
          weight,
          callsign,
          prize,
          rewards: 0,
          status: CargoStatus.STARTED,
          remote,
          isRewarded: false
        }
        setCargo(cargo)
      } catch (err) {
        const error = err as Error
        console.error(error)
        throw new Error(error.message)
      }
    },
    [setCargo]
  )

  const getCompletedCount = useCallback(async () => {
    try {
      const { data } = await nextApiInstance.get<{ count: number }>('/api/cargo/count')
      setCompleted(data.count)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    getCompletedCount()
  }, [getCompletedCount])

  return { newCargo, cargo, getCargo, setCargo, isLoading, completed }
}

export default useCargo
