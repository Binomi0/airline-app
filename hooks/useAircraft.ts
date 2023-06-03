import { useContract, useNFTBalance, useUser } from '@thirdweb-dev/react'
import { nftAircraftTokenAddress } from 'contracts/address'

const useAircraft = (id?: string) => {
  const { user } = useUser()
  const { contract } = useContract(nftAircraftTokenAddress)

  const { data } = useNFTBalance(contract, user?.address, id)

  return !data?.isZero()
}

export default useAircraft
