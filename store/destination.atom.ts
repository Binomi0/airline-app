import { atom } from 'recoil'
import { DestinationAirport } from 'types'

export const destinationStore = atom<DestinationAirport | undefined>({
  key: 'destinationStore',
  default: undefined
})
