import { Hex, SmartAccountClient, SmartContractAccount } from '@alchemy/aa-core'

type Actions = SetBaseSigner | SetSmartSigner | SetPaymasterSigner | SetSmartAccountAddress
type SetBaseSigner = Readonly<{ type: 'SET_BASE_SIGNER'; payload: SmartContractAccount | undefined }>
type SetSmartSigner = Readonly<{ type: 'SET_SMART_SIGNER'; payload: SmartAccountClient | undefined }>
type SetPaymasterSigner = Readonly<{ type: 'SET_PAYMASTER_SIGNER'; payload: any | undefined }>
type SetSmartAccountAddress = Readonly<{ type: 'SET_SMART_ACCOUNT_ADDRESS'; payload: Hex | undefined }>

export type AlchemyReducerState = {
  baseSigner?: SmartContractAccount
  smartSigner?: SmartAccountClient
  paymasterSigner?: any
  smartAccountAddress?: Hex
}

export type AlchemyContextProps = AlchemyReducerState & {
  setBaseSigner: (signer?: SmartContractAccount) => void
  setSmartSigner: (SmartAccountClient?: any) => void
  setPaymasterSigner: (signer?: any) => void
  setSmartAccountAddress: (address?: Hex) => void
}

export type AlchemyReducerHandler = (state: AlchemyReducerState, action: Actions) => AlchemyReducerState
