import { useReadContract } from 'thirdweb/react'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { getOwnedNFTs } from 'thirdweb/extensions/erc721'
import { useAppContracts } from 'hooks/useAppContracts'

interface UseAircraftReturnType {
  hasAircraft: boolean
  refetch: () => void
}

const useAircraft = (): UseAircraftReturnType => {
  const { smartAccountAddress } = useRecoilValue(walletStore)
  const { aircraftContract: contract } = useAppContracts()

  const { data, refetch } = useReadContract(getOwnedNFTs, {
    contract: contract!,
    owner: smartAccountAddress!
  })

  return { hasAircraft: !!data && data.length > 0, refetch }
}

export default useAircraft
