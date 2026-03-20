import { nftAircraftTokenAddress } from 'contracts/address'
import useOwnedNfts from 'hooks/useOwnedNFTs'

interface UseAircraftReturnType {
  hasAircraft: boolean
  media: string
}

const useAircraft = (tokenId: string): UseAircraftReturnType => {
  const { data: ownedNfts } = useOwnedNfts()

  const aircraft = ownedNfts?.find(
    (n) => n.tokenId === tokenId && n.tokenAddress.toLowerCase() === nftAircraftTokenAddress.toLowerCase()
  )
  return { hasAircraft: !!aircraft, media: aircraft?.nft.metadata.image || '' }
}

export default useAircraft
