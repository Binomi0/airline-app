import { useReadContract } from 'thirdweb/react'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { getOwnedNFTs } from 'thirdweb/extensions/erc721'
import { useAppContracts } from 'hooks/useAppContracts'

const useLicense = () => {
  const { smartAccountAddress } = useRecoilValue(walletStore)
  const { licenseContract: contract } = useAppContracts()

  const { data, refetch } = useReadContract(getOwnedNFTs, { 
    contract: contract!, 
    owner: smartAccountAddress!,
    queryOptions: {
      enabled: !!contract && !!smartAccountAddress
    }
  })

  const hasLicense = !!data && data.length > 0

  return { hasLicense, refetch }
}

export default useLicense
