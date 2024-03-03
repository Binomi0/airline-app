import { NFT } from '@thirdweb-dev/sdk'
import AircraftItem from 'components/AircraftItem'
import React from 'react'

interface Props {
  aircrafts: Readonly<NFT[]>
  onClaim: (aircraftNFT: NFT) => (refetch: () => void) => Promise<void>
  isClaiming: boolean
}

const AircraftList = ({ aircrafts, isClaiming, onClaim }: Props) => {
  return aircrafts.map((aircraft) => (
    <AircraftItem nft={aircraft} key={aircraft.metadata.id} onClaim={onClaim(aircraft)} isClaiming={isClaiming} />
  ))
}

export default AircraftList
