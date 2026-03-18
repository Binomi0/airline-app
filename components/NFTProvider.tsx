import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import { INft } from 'models/Nft'
import { createContext, useContext, useMemo } from 'react'
import useSWR from 'swr'
import { fetcher } from 'utils'

type NftContextType = {
  aircrafts: INft[]
  licenses: INft[]
}

const NftContext = createContext<NftContextType>({ aircrafts: [], licenses: [] })

interface Props {
  children: JSX.Element
}

const NFTProviderWrapper = ({ children }: Props) => {
  const { data: nfts = [] } = useSWR<INft[]>('/api/nft', fetcher)

  const aircrafts = useMemo(
    () => nfts?.filter((nft) => nft.tokenAddress.toLowerCase() === nftAircraftTokenAddress.toLowerCase()),
    [nfts]
  )
  const licenses = useMemo(
    () => nfts?.filter((nft) => nft.tokenAddress.toLowerCase() === nftLicenseTokenAddress.toLowerCase()),
    [nfts]
  )

  return <NftContext.Provider value={{ aircrafts, licenses }}>{children}</NftContext.Provider>
}

export const useNFTProviderContext = () => useContext(NftContext)

export default NFTProviderWrapper
