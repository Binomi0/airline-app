import { useContract, useNFTBalance } from '@thirdweb-dev/react'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { nftAircraftTokenAddress } from 'contracts/address'

interface UseAircraftReturnType {
  hasAircraft: boolean,
  refetch: () => void
}

const useAircraft = (id?: string): UseAircraftReturnType => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data, refetch } = useNFTBalance(contract, smartAccountAddress, id)

  return { hasAircraft: smartAccountAddress ? !data?.isZero() : false, refetch }
}

export default useAircraft
