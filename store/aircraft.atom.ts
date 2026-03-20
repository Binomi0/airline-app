import { atom } from 'recoil'
import { INft } from 'models/Nft'

type AircraftStore = {
  ownedAircrafts: Readonly<INft[]>
  aircrafts: Readonly<INft[]>
  isLoading: boolean
}

export const aircraftStore = atom<AircraftStore | undefined>({
  key: 'aircraft',
  default: undefined
})
