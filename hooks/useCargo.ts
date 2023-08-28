import { NFT } from '@thirdweb-dev/sdk'
import axios from 'config/axios'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { useVaProviderContext } from 'context/VaProvider'
import { cargos } from 'mocks/cargos'
import { useCallback, useState } from 'react'
import { Cargo, FRoute } from 'types'
import { getCallsign, getCargoWeight, getDistanceByCoords, getRandomInt, getCargoPrize } from 'utils'

interface UseCargo {
  newCargo: (route: FRoute, owned: NFT) => void
  getCargo: () => Promise<void>
  cargo?: Cargo
  isLoading: boolean
}

const useCargo = (): UseCargo => {
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const { atcs } = useVaProviderContext()
  const [cargo, setCargo] = useState<Cargo>()
  const [isLoading, setIsLoading] = useState(false)

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
  }, [])

  const newCargo = useCallback(
    async (route: FRoute, aircraft: NFT) => {
      const distance = getDistanceByCoords(atcs, route)
      const details = cargos[getRandomInt(8)]
      const weight = getCargoWeight(aircraft)
      // FIXME: get current callsign
      const callsign = getCallsign()
      const prize = getCargoPrize(distance, aircraft)
      const cargo = {
        address,
        origin: route.origin,
        destination: route.destination,
        distance,
        details,
        aircraftId: aircraft.metadata.id,
        aircraft,
        weight,
        callsign,
        prize
      }

      try {
        await axios.post('/api/cargo/new', cargo)
        setCargo(cargo)
      }
      catch(error) {
        console.error(error)
      }

    },
    [atcs, address]
  )

  return { newCargo, cargo, getCargo, isLoading }
}

export default useCargo
