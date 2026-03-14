import React from 'react'
import { useSetRecoilState } from 'recoil'
import { aircraftNftStore, ownedAircraftNftStore } from 'store/aircraftNFT.atom'
import { fetcher } from 'utils'
import useSWR from 'swr'
import { useAppContracts } from 'hooks/useAppContracts'

interface Props {
  children: JSX.Element
}

export const AircraftProvider = ({ children }: Props) => {
  const { data: nfts } = useSWR<any[]>('/api/nft', fetcher)
  const setAircraftNFTs = useSetRecoilState(aircraftNftStore)
  const setOwnedAircraftsStore = useSetRecoilState(ownedAircraftNftStore)
  const { aircraftContract } = useAppContracts()

  const aircrafts = React.useMemo(() => {
    if (!nfts) return []
    return nfts.filter((nft: any) => nft.tokenAddress.toLowerCase() === (aircraftContract?.address || '').toLowerCase())
  }, [nfts, aircraftContract])

  const ownedAircrafts = React.useMemo(() => {
    return aircrafts.filter((nft: any) => nft.owner !== null)
  }, [aircrafts])

  React.useEffect(() => {
    setAircraftNFTs(aircrafts)
  }, [aircrafts, setAircraftNFTs])

  React.useEffect(() => {
    setOwnedAircraftsStore(ownedAircrafts)
  }, [ownedAircrafts, setOwnedAircraftsStore])

  return children
}
