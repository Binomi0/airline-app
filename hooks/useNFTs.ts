import React from 'react'
import { getContract, NFT } from 'thirdweb'
import { getNFTs } from 'thirdweb/extensions/erc721'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'

const useNFTs = (contractAddress: string) => {
  const { twClient, twChain } = useRecoilValue(walletStore)
  const [data, setData] = React.useState<NFT[]>()
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const fetchNFTs = React.useCallback(async () => {
    if (!twClient || !twChain || !contractAddress) return
    setIsLoading(true)

    try {
      const contract = getContract({
        client: twClient,
        chain: twChain,
        address: contractAddress as `0x${string}`
      })
      const nfts = await getNFTs({ contract })
      setData(nfts)
    } catch (error) {
      console.error(error)
      setData(undefined)
      setError('Error getting nfts')
    } finally {
      setIsLoading(false)
    }
  }, [contractAddress, twChain, twClient])

  React.useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  return { data, isLoading, error }
}

export default useNFTs
