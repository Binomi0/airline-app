import { nftAircraftTokenAddress } from 'contracts/address'
import useOwnedNfts from 'hooks/useOwnedNFTs'

interface UseAircraftReturnType {
  hasAircraft: boolean
}

const useAircraft = (tokenId: string): UseAircraftReturnType => {
  const { data: ownedNfts } = useOwnedNfts()

  const hasAircraft = ownedNfts?.some(
    (n) => n.tokenId === tokenId && n.tokenAddress.toLowerCase() === nftAircraftTokenAddress.toLowerCase()
  )
  return { hasAircraft: !!hasAircraft }
}

export default useAircraft
