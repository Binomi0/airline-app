import React from 'react'
import { useContract, useNFTs, useOwnedNFTs } from '@thirdweb-dev/react'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { userState } from 'store/user.atom'
import { aircraftNftStore, ownedAircraftNftStore } from 'store/aircraftNFT.atom'
import LinearProgress from '@mui/material/LinearProgress'

interface Props {
  children: React.ReactNode
}

export const AircraftProvider = ({ children }: Props) => {
  const user = useRecoilValue(userState)
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data: aircrafts } = useNFTs(contract)
  const { data: ownedAircrafts } = useOwnedNFTs(contract, user?.address)
  const setAircraftNFTs = useSetRecoilState(aircraftNftStore)
  const setOwnedAircrafts = useSetRecoilState(ownedAircraftNftStore)

  React.useEffect(() => {
    setAircraftNFTs(aircrafts)
  }, [aircrafts, setAircraftNFTs])

  React.useEffect(() => {
    setOwnedAircrafts(ownedAircrafts)
  }, [ownedAircrafts, setOwnedAircrafts])

  return <React.Suspense fallback={<LinearProgress />}>{children}</React.Suspense>
}
