import React from 'react'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useSetRecoilState } from 'recoil'
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
  const contract = getContract({ address: nftAircraftTokenAddress, chain: sepolia, client: twClient })
  const { data: aircrafts } = useNFTs(contract.address)
  const { data: ownedAircrafts } = useOwnedNfts(contract.address)
  console.log({ ownedAircrafts, aircrafts })

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
