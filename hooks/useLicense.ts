import { useReadContract } from 'thirdweb/react'
import { nftLicenseTokenAddress } from 'contracts/address'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { getContract } from 'thirdweb'
import { getOwnedNFTs } from 'thirdweb/extensions/erc721'
import { useMemo } from 'react'

const useLicense = () => {
  const { twClient, twChain, smartAccountAddress } = useRecoilValue(walletStore)

  const contract = useMemo(() => {
    if (!twClient || !twChain) return undefined
    return getContract({
      client: twClient,
      address: nftLicenseTokenAddress,
      chain: twChain
    })
  }, [twChain, twClient])

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
