/* eslint-disable no-unused-vars */
import { NFT } from '@thirdweb-dev/sdk'

type Actions = SetAircrafts | SetOwnedAircrafts
type SetOwnedAircrafts = Readonly<{ type: 'SET_OWNED_AIRCRAFTS'; payload: Readonly<NFT[]> }>
type SetAircrafts = Readonly<{ type: 'SET_AIRCRAFTS'; payload: Readonly<NFT[]> }>

export type AircraftReducerState = {
  ownedAircrafts: Readonly<NFT[]>
  aircrafts: Readonly<NFT[]>
  isLoading: boolean
}

export type AircraftContextProps = AircraftReducerState & {
  setOwnedAircrafts: (aircrafts: Readonly<NFT[]>) => void
  setAircrafts: (aircrafts: Readonly<NFT[]>) => void
  refetchAircrafts: () => void
}

export type AircraftReducerHandler = (state: AircraftReducerState, action: Actions) => AircraftReducerState
