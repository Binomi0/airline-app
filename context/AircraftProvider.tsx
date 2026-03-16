import React from 'react'
import { useSetRecoilState } from 'recoil'
import { aircraftNftStore, ownedAircraftNftStore } from 'store/aircraftNFT.atom'
import { fetcher } from 'utils'
import useSWR from 'swr'
import { useAppContracts } from 'hooks/useAppContracts'
import useOwnedNfts from 'hooks/useOwnedNFTs'
import { Hex } from 'thirdweb'

interface Props {
  children: JSX.Element
}

export const AircraftProvider = ({ children }: Props) => {
  const { data: nfts } = useSWR<any[]>('/api/nft', fetcher)
  const setAircraftNFTs = useSetRecoilState(aircraftNftStore)
  const setOwnedAircraftsStore = useSetRecoilState(ownedAircraftNftStore)
  const { aircraftContract } = useAppContracts()
  const { data: ownedNfts } = useOwnedNfts(aircraftContract?.address as Hex)

  const aircrafts = React.useMemo(() => {
    if (!nfts) return []
    const filtered = nfts.filter(
      (nft: any) => nft.tokenAddress.toLowerCase() === (aircraftContract?.address || '').toLowerCase()
    )

    // Deduplicate by ID to avoid React key warnings (caused by inconsistent address casing in DB)
    const unique = new Map()
    filtered.forEach((nft) => unique.set(nft.id.toString(), nft))
    return Array.from(unique.values())
  }, [nfts, aircraftContract])

  React.useEffect(() => {
    setAircraftNFTs(aircrafts)
  }, [aircrafts, setAircraftNFTs])

  React.useEffect(() => {
    if (ownedNfts) {
      setOwnedAircraftsStore(ownedNfts)
    }
  }, [ownedNfts, setOwnedAircraftsStore])

  return children
}
