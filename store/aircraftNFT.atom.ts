import { atom } from 'recoil'
import { INft } from 'models/Nft'

export const aircraftNftStore = atom<INft[] | undefined>({
  key: 'aircraftNftStore',
  default: undefined
})

export const ownedAircraftNftStore = atom<INft[] | undefined>({
  key: 'ownedAircraftNftStore',
  default: undefined
})
