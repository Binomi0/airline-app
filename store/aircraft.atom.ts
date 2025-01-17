import { Nft } from 'alchemy-sdk'
import { atom } from 'recoil'

export const aircraftStore = atom<Nft[]>({
  key: 'aircraftNftStore',
  default: []
})
export const ownedAircraftStore = atom<Nft[]>({
  key: 'ownedAircraftNftStore',
  default: []
})
