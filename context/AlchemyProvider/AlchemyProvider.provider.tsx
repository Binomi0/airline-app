import React, { FC, useCallback, useReducer } from 'react'
import alchemyProviderReducer from './AlchemyProvider.reducer'
import { AlchemyProviderContext } from './AlchemyProvider.context'
import { AlchemyReducerState } from './AlchemyProvider.types'
import { Hex, SmartAccountProvider } from '@alchemy/aa-core'

export const INITIAL_STATE: AlchemyReducerState = {
  smartSigner: undefined,
  paymasterSigner: undefined,
  smartAccountAddress: undefined
}

export const AlchemyProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(alchemyProviderReducer, {
    ...INITIAL_STATE
  })
  const { Provider } = AlchemyProviderContext

  const setBaseSigner = useCallback(
    (signer: SmartAccountProvider) => dispatch({ type: 'SET_BASE_SIGNER', payload: signer }),
    []
  )

  const setPaymasterSigner = useCallback(
    (signer: SmartAccountProvider) => dispatch({ type: 'SET_PAYMASTER_SIGNER', payload: signer }),
    []
  )

  const setSmartAccountAddress = useCallback(
    (address: Hex) => dispatch({ type: 'SET_SMART_ACCOUNT_ADDRESS', payload: address }),
    []
  )

  return <Provider value={{ ...state, setBaseSigner, setPaymasterSigner, setSmartAccountAddress }}>{children}</Provider>
}