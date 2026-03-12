import React from 'react'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { userState } from 'store/user.atom'
import { aircraftNftStore, ownedAircraftNftStore } from 'store/aircraftNFT.atom'
import { getContract } from 'thirdweb'
import { sepolia } from 'thirdweb/chains'
import { twClient } from 'components/CustomWeb3Provider'
import useNFTs from 'hooks/useNFTs'
import useOwnedNfts from 'hooks/useOwnedNFTs'

interface Props {
  children: JSX.Element
}

export const AircraftProvider = ({ children }: Props) => {
  const user = useRecoilValue(userState)
  const contract = getContract({ address: nftAircraftTokenAddress, chain: sepolia, client: twClient })
  const { data: aircrafts } = useNFTs(contract.address)
  const { data: ownedAircrafts } = useOwnedNfts(contract.address)

  const setAircraftNFTs = useSetRecoilState(aircraftNftStore)
  const setOwnedAircrafts = useSetRecoilState(ownedAircraftNftStore)

  React.useEffect(() => {
    setAircraftNFTs(aircrafts)
  }, [aircrafts, setAircraftNFTs])

  React.useEffect(() => {
    setOwnedAircrafts(ownedAircrafts)
  }, [ownedAircrafts, setOwnedAircrafts])

  return children
}
