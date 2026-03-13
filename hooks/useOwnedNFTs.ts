import React from 'react'
import { getContract, NFT } from 'thirdweb'
import { getOwnedNFTs } from 'thirdweb/extensions/erc721'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'

const useOwnedNfts = (tokenAddress?: string) => {
  const { smartAccountAddress, twClient, twChain } = useRecoilValue(walletStore)
  const [data, setData] = React.useState<NFT[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const fetchOwnedNfts = React.useCallback(async () => {
    if (!smartAccountAddress || !tokenAddress || !twClient || !twChain) return
    try {
      setIsLoading(true)
      const contract = getContract({
        client: twClient,
        chain: twChain,
        address: tokenAddress as `0x${string}`
      })
      const nfts = await getOwnedNFTs({ 
        contract, 
        owner: smartAccountAddress 
      })
      setData(nfts)
    } catch (error) {
      console.error('useOwnedNFTs', error)
      setError(error as string)
    } finally {
      setIsLoading(false)
    }
  }, [smartAccountAddress, tokenAddress, twChain, twClient])

  React.useEffect(() => {
    fetchOwnedNfts()
  }, [fetchOwnedNfts])

  return {
    data,
    isLoading,
    error
  }
}

export default useOwnedNfts
