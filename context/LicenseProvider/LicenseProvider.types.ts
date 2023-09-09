import { Wallet } from 'ethers'

type Actions = SetBaseSigner
type SetBaseSigner = Readonly<{ type: 'SET_BASE_SIGNER'; payload: Wallet | undefined }>

export type LicenseReducerState = {}

export type LicenseContextProps = LicenseReducerState & {
  setBaseSigner: (signer?: Wallet) => void
}

export type LicenseReducerHandler = (state: LicenseReducerState, action: Actions) => LicenseReducerState
