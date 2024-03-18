import { Hex } from '@alchemy/aa-core'
import { OwnedNft } from 'alchemy-sdk'
import alchemy from 'lib/alchemy'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'

const useOwnedNfts = (token?: Hex) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const [data, setData] = React.useState<OwnedNft[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const getNftsForOwner = React.useCallback(async () => {
    if (!smartAccountAddress || !token) return
    try {
      setIsLoading(true)
      const nfts = await alchemy.nft.getNftsForOwner(smartAccountAddress)
      const ownedNfts = nfts.ownedNfts.filter((nft) => nft.contract?.address.toLowerCase() === token.toLowerCase())
      setData(ownedNfts)
    } catch (error) {
      console.error('useOwnedNFTs', error)
      setError(error as string)
    } finally {
      setIsLoading(false)
    }
  }, [smartAccountAddress, token])

  React.useEffect(() => {
    getNftsForOwner()
  }, [getNftsForOwner])

  return {
    data,
    isLoading,
    error
  }
}

export default useOwnedNfts
