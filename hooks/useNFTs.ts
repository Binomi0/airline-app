import React from 'react'
import alchemy from 'lib/alchemy'
import { Hex, NFT } from 'thirdweb'

const useNFTs = (contract: Hex) => {
  const [data, setData] = React.useState<NFT[]>()
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const getNFTs = React.useCallback(async () => {
    setIsLoading(true)

    try {
      const { nfts } = await alchemy.nft.getNftsForContract(contract)
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
