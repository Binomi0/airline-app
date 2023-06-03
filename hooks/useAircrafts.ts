import { useContract, useNFTs } from '@thirdweb-dev/react'
import { nftAircraftTokenAddress } from 'contracts/address'

const useAircrafts = () => {
  const { contract: aircraftContract } = useContract(nftAircraftTokenAddress)
  const { data: nfts = [], isLoading } = useNFTs(aircraftContract)

  return { aircrafts: nfts, isLoading }
}

export default useAircrafts
