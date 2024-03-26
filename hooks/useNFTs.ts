import React from 'react'
import { Nft } from 'alchemy-sdk'
import { Hex } from '@alchemy/aa-core'
import alchemy from 'lib/alchemy'

const useNFTs = (contract: Hex) => {
  const [data, setData] = React.useState<Nft[]>()
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
