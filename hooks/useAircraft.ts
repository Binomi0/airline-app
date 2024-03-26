import { useContract, useNFTBalance } from '@thirdweb-dev/react'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'

interface UseAircraftReturnType {
  hasAircraft: boolean
  refetch: () => void
}

const useAircraft = (id?: string): UseAircraftReturnType => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data, refetch } = useNFTBalance(contract, smartAccountAddress, id)

  return { hasAircraft: smartAccountAddress ? !data?.isZero() : false, refetch }
}

export default useAircraft
