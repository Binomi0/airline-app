import { useContract, useNFTBalance } from '@thirdweb-dev/react'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { nftAircraftTokenAddress } from 'contracts/address'

const useAircraft = (id?: string) => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data } = useNFTBalance(contract, smartAccountAddress, id)

  return { hasAircraft: smartAccountAddress ? !data?.isZero() : false }
}

export default useAircraft
