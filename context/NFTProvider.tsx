import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import { INft } from 'models/Nft'
import { createContext, useContext, useMemo } from 'react'
import useSWR, { mutate } from 'swr'
import { fetcher, filterByTokenAddress } from 'utils'

type NftContextType = {
  aircrafts: INft[]
  licenses: INft[]
  refetch: () => void
}

const NftContext = createContext<NftContextType>({
  aircrafts: [],
  licenses: [],
  refetch: () => {}
})

interface Props {
  children: JSX.Element
}

const NFTProviderWrapper = ({ children }: Props) => {
  const { data: nfts = [] } = useSWR<INft[]>('/api/nft', fetcher)

  const aircrafts = useMemo(() => nfts?.filter(filterByTokenAddress(nftAircraftTokenAddress)), [nfts])
  const licenses = useMemo(() => nfts?.filter(filterByTokenAddress(nftLicenseTokenAddress)), [nfts])

  const refetch = () => mutate('/api/nft')

  return <NftContext.Provider value={{ aircrafts, licenses, refetch }}>{children}</NftContext.Provider>
}

export const useNFTProviderContext = () => useContext(NftContext)

export default NFTProviderWrapper
