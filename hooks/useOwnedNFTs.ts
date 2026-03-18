import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import useSWR from 'swr'
import { fetcher } from 'utils'
import { IUserNftPopulated } from 'models/UserNft'

const useOwnedNfts = () => {
  const { smartAccountAddress } = useRecoilValue(walletStore)

  // Only fetch if we have a wallet address
  const {
    data: userNfts,
    error,
    isLoading
  } = useSWR<IUserNftPopulated[]>(smartAccountAddress ? '/api/nft/owned' : null, fetcher)

  // console.log({ ownedNFTs: data })
  // const filteredData = useMemo(() => {
  //   if (!data) return [] as (NFT & { userNftId: string; tokenId: string | bigint })[]

  //   // Filter by tokenAddress if provided
  //   const filtered = tokenAddress
  //     ? data.filter((item) => item.tokenAddress.toLowerCase() === tokenAddress.toLowerCase())
  //     : data

  //   // Map to a structure compatible with existing components
  //   // Existing components expect property like aircraft.name and aircraft.raw.metadata.attributes
  //   return filtered.map((item) => ({
  //     ...item.nft,
  //     id: typeof item.nft.id === 'string' ? BigInt(item.nft.id) : item.nft.id,
  //     supply: typeof item.nft.supply === 'string' ? BigInt(item.nft.supply) : item.nft.supply || 0n,
  //     tokenId: item.tokenId,
  //     owner: item.address,
  //     // Map metadata properties to top-level for convenience
  //     name: item.nft?.metadata?.name,
  //     description: item.nft?.metadata?.description,
  //     image: item.nft?.metadata?.image,
  //     // Mimic thirdweb raw structure for components using it
  //     raw: {
  //       metadata: item.nft?.metadata
  //     },
  //     userNftId: item._id.toString()
  //   })) as unknown as (NFT & { userNftId: string; tokenId: string | bigint })[]
  // }, [data, tokenAddress])

  return {
    data: userNfts,
    isLoading,
    error
  }
}

export default useOwnedNfts
