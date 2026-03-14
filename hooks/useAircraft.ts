import { useRecoilValue } from 'recoil'
import { ownedAircraftNftStore } from 'store/aircraftNFT.atom'

interface UseAircraftReturnType {
  hasAircraft: boolean
  refetch: () => void
}

const useAircraft = (): UseAircraftReturnType => {
  const data = useRecoilValue(ownedAircraftNftStore)

  return { hasAircraft: !!data && data.length > 0, refetch: () => {} }
}

export default useAircraft
