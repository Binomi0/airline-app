import { Hex } from '@alchemy/aa-core'
import { OwnedNft } from 'alchemy-sdk'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import alchemy from 'lib/alchemy'
import React from 'react'

const useOwnedNfts = (token?: Hex) => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const [data, setData] = React.useState<OwnedNft[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const load = React.useCallback(async () => {
    if (!smartAccountAddress) return

    try {
      setIsLoading(true)
      const nfts = await alchemy.nft.getNftsForOwner(smartAccountAddress)
      const ownedNfts = nfts.ownedNfts.filter((nft) => nft?.contract?.address.toLowerCase() === token?.toLowerCase())
      setData(ownedNfts)
    } catch (error) {
      console.error('useOwnedNFTs', error)
      setError(error as string)
    } finally {
      setIsLoading(false)
    }
  }, [smartAccountAddress, token])

  React.useEffect(() => {
    if (!token) return
    load()
  }, [load, token])

  return {
    data,
    isLoading,
    error
  }
}

export default useOwnedNfts
