import { useRecoilValue } from 'recoil'
import { ownedAircraftNftStore } from 'store/aircraftNFT.atom'

interface UseAircraftReturnType {
  hasAircraft: boolean
  isAircraftOwned: (id: string | bigint) => boolean
}

const useAircraft = (): UseAircraftReturnType => {
  const data = useRecoilValue(ownedAircraftNftStore)

  const isAircraftOwned = (id: string | bigint) => {
    return !!data && data.some((n) => BigInt(n.id) === BigInt(id))
  }

  return { hasAircraft: !!data && data.length > 0, isAircraftOwned }
}

export default useAircraft
