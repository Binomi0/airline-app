import { atom } from 'recoil'

interface Airport {
  callsign: string
  distance: number
  name: string
  city: string
}

interface DestinationAirport {
  airport: string
  destinations: Airport[]
}

export const destinationStore = atom<DestinationAirport | undefined>({
  key: 'destinationStore',
  default: undefined
})
