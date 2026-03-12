import { useContract, useNFTBalance, useReadContract } from 'thirdweb/react'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { createThirdwebClient } from 'thirdweb'
import { getContract } from 'thirdweb'
import { sepolia } from 'thirdweb/chains'
import { getOwnedNFTs } from 'thirdweb/extensions/erc721'

interface UseAircraftReturnType {
  hasAircraft: boolean
  refetch: () => void
}

const useAircraft = (id?: string): UseAircraftReturnType => {
  const contract = getContract({
    client,
    address: nftAircraftTokenAddress,
    chain: sepolia
  })
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  // const newContract = useReadContract({ contract })
  const { data, refetch } = useReadContract(getOwnedNFTs, { contract, owner: smartAccountAddress! })

  // const { data, refetch } = useNFTBalance(contract, smartAccountAddress, id)

  return { hasAircraft: smartAccountAddress ? !data?.length : false, refetch }
}

export default useAircraft
