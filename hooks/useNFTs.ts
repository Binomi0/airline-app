import React from 'react'
import { Alchemy, Network, Nft } from 'alchemy-sdk'
import { Hex } from '@alchemy/aa-core'

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_SEPOLIA,
  network: Network.ETH_SEPOLIA
}
const alchemy = new Alchemy(config)

const useNFTs = (contract: Hex) => {
  const [data, setData] = React.useState<Nft[]>()
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const getNFTs = React.useCallback(async () => {
    setIsLoading(true)

    try {
      const { nfts } = await alchemy.nft.getNftsForContract(contract)
      console.log({ nfts })
      setData(nfts)
    } catch (error) {
      console.error(error)
      setData(undefined)
      setError('Error getting nfts')
    } finally {
      setIsLoading(false)
    }
  }, [contract])

  React.useEffect(() => {
    getNFTs()
  }, [getNFTs])

  return { data, isLoading, error }
}

export default useNFTs
