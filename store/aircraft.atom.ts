import { NFT } from '@thirdweb-dev/sdk'
import { atom } from 'recoil'

type AircraftStore = {
  ownedAircrafts: Readonly<NFT[]>
  aircrafts: Readonly<NFT[]>
  isLoading: boolean
}

export const aircraftStore = atom<AircraftStore | undefined>({
  key: 'aircraft',
  default: undefined
})
