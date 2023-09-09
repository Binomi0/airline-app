import { Wallet } from 'ethers'

type Actions = SetBaseSigner
type SetBaseSigner = Readonly<{ type: 'SET_BASE_SIGNER'; payload: Wallet | undefined }>

export type AircraftReducerState = {}

export type AircraftContextProps = AircraftReducerState & {
  setBaseSigner: (signer?: Wallet) => void
}

export type AircraftReducerHandler = (state: AircraftReducerState, action: Actions) => AircraftReducerState
