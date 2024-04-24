/* eslint-disable no-unused-vars */
import { NFT } from '@thirdweb-dev/sdk'

type Actions = SetAircrafts | SetOwnedAircrafts
type SetOwnedAircrafts = { type: 'SET_OWNED_AIRCRAFTS'; payload: NFT[] }
type SetAircrafts = { type: 'SET_AIRCRAFTS'; payload: NFT[] }

export type AircraftReducerState = {
  ownedAircrafts: NFT[]
  aircrafts: NFT[]
  isLoading: boolean
}

export type AircraftContextProps = AircraftReducerState & {
  setOwnedAircrafts: (aircrafts: NFT[]) => void
  setAircrafts: (aircrafts: NFT[]) => void
  refetchAircrafts: () => void
}

export type AircraftReducerHandler = (state: AircraftReducerState, action: Actions) => AircraftReducerState
