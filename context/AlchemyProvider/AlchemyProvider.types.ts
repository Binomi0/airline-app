import { Hex } from '@alchemy/aa-core'
import { Wallet } from 'ethers'

type Actions<T> = SetBaseSigner | SetSmartSigner<T> | SetSmartAccountAddress
type SetBaseSigner = Readonly<{ type: 'SET_BASE_SIGNER'; payload: Wallet | undefined }>
type SetSmartSigner<T> = Readonly<{ type: 'SET_SMART_SIGNER'; payload: T | undefined }>
type SetSmartAccountAddress = Readonly<{ type: 'SET_SMART_ACCOUNT_ADDRESS'; payload: Hex | undefined }>

export type AlchemyReducerState = {
  baseSigner?: Wallet
  smartSigner?: any
  smartAccountAddress?: Hex
}

export type AlchemyContextProps = AlchemyReducerState & {
  setBaseSigner: (signer?: Wallet) => void
  setSmartSigner: <T>(SmartAccountClient?: T) => void
  setSmartAccountAddress: (address?: Hex) => void
}

export type AlchemyReducerHandler = (state: AlchemyReducerState, action: Actions<any>) => AlchemyReducerState
