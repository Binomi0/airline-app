import { Hex } from 'thirdweb'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import useSWR from 'swr'
import { fetcher } from 'utils'
import { useMemo } from 'react'

const useOwnedNfts = (tokenAddress?: Hex) => {
  const { smartAccountAddress } = useRecoilValue(walletStore)

  // Only fetch if we have a wallet address
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    smartAccountAddress ? '/api/nft/owned' : null,
    fetcher
  )

  const filteredData = useMemo(() => {
    if (!data) return []
    
    // Filter by tokenAddress if provided
    const filtered = tokenAddress 
      ? data.filter((item) => item.tokenAddress.toLowerCase() === tokenAddress.toLowerCase())
      : data

    // Map to a structure compatible with existing components
    // Existing components expect property like aircraft.name and aircraft.raw.metadata.attributes
    return filtered.map((item) => ({
      ...item.nft,
      tokenId: item.tokenId,
      owner: item.address,
      // Map metadata properties to top-level for convenience
      name: item.nft?.metadata?.name,
      description: item.nft?.metadata?.description,
      image: item.nft?.metadata?.image,
      // Mimic thirdweb raw structure for components using it
      raw: {
        metadata: item.nft?.metadata
      },
      userNftId: item._id
    }))
  }, [data, tokenAddress])

  return {
    data: filteredData,
    isLoading,
    error,
    mutate
  }
}

export default useOwnedNfts
