import { useReadContract } from 'thirdweb/react'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { getContract } from 'thirdweb'
import { getOwnedNFTs } from 'thirdweb/extensions/erc721'

interface UseAircraftReturnType {
  hasAircraft: boolean
  refetch: () => void
}

const useAircraft = (): UseAircraftReturnType => {
  const { twClient, twChain, smartAccountAddress } = useRecoilValue(walletStore)

  const contract = getContract({
    client: twClient!,
    address: nftAircraftTokenAddress,
    chain: twChain!
  })

  const { data, refetch } = useReadContract(getOwnedNFTs, {
    contract,
    owner: smartAccountAddress!
  })

  return { hasAircraft: !!data && data.length > 0, refetch }
}

export default useAircraft
