import { Hex, SmartAccountProvider } from '@alchemy/aa-core'
import { Wallet } from 'ethers'

type Actions = SetBaseSigner | SetSmartSigner | SetPaymasterSigner | SetSmartAccountAddress
type SetBaseSigner = Readonly<{ type: 'SET_BASE_SIGNER'; payload: Wallet | undefined }>
type SetSmartSigner = Readonly<{ type: 'SET_SMART_SIGNER'; payload: SmartAccountProvider }>
type SetPaymasterSigner = Readonly<{ type: 'SET_PAYMASTER_SIGNER'; payload: SmartAccountProvider }>
type SetSmartAccountAddress = Readonly<{ type: 'SET_SMART_ACCOUNT_ADDRESS'; payload: Hex }>

export type AlchemyReducerState = {
  baseSigner?: Wallet
  smartSigner?: SmartAccountProvider
  paymasterSigner?: SmartAccountProvider
  smartAccountAddress?: Hex
}

export type AlchemyContextProps = AlchemyReducerState & {
  setBaseSigner: (signer?: Wallet) => void
  setSmartSigner: (signer: SmartAccountProvider) => void
  setPaymasterSigner: (signer: SmartAccountProvider) => void
  setSmartAccountAddress: (address: Hex) => void
}

export type AlchemyReducerHandler = (state: AlchemyReducerState, action: Actions) => AlchemyReducerState
