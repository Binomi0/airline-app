import { NFT } from '@thirdweb-dev/sdk'
import axios from 'config/axios'
import { useVaProviderContext } from 'context/VaProvider'
import { cargos } from 'mocks/cargos'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { cargoStore } from 'store/cargo.atom'
import { Cargo, CargoStatus, FRoute } from 'types'
import { getCargoWeight, getDistanceByCoords, getRandomInt, getCargoPrize } from 'utils'

interface UseCargo {
  // eslint-disable-next-line no-unused-vars
  newCargo: (route: FRoute, owned: NFT, callsign: string, remote: boolean) => Promise<void>
  getCargo: () => Promise<void>
  // eslint-disable-next-line no-unused-vars
  setCargo: (cargo?: Cargo) => void
  cargo?: Cargo
  isLoading: boolean
  completed: number
}

const useCargo = (): UseCargo => {
  const { atcs } = useVaProviderContext()
  const [cargo, setCargo] = useRecoilState(cargoStore)
  const [isLoading, setIsLoading] = useState(false)
  const [completed, setCompleted] = useState(0)

  const getCargo = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get<Cargo>('/api/cargo')
      setCargo(response.data)
    } catch (error) {
      console.error('error =>', error)
    } finally {
      setIsLoading(false)
    }
  }, [setCargo])

  const newCargo = useCallback(
    async (route: FRoute, aircraft: NFT, callsign: string, remote: boolean) => {
      if (!atcs) {
        throw new Error('Missing required ATCs')
      }

      try {
        const distance = await getDistanceByCoords(atcs, route)
        const details = cargos[getRandomInt(8)]
        const weight = getCargoWeight(aircraft)
        const prize = getCargoPrize(distance, aircraft)
        const cargo: Cargo = {
          origin: route.origin,
          destination: route.destination,
          distance,
          details,
          aircraft,
          aircraftId: aircraft.metadata.id,
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
    [atcs, setCargo]
  )

  const getCompletedCount = useCallback(async () => {
    try {
      const { data } = await axios.get<{ count: number }>('/api/cargo/count')
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
