import React, { FC, useCallback, useReducer } from 'react'
import aircraftProviderReducer from './LicenseProvider.reducer'
import { LicenseProviderContext } from './LicenseProvider.context'
import { LicenseReducerState } from './LicenseProvider.types'
import { Wallet } from 'ethers'

export const INITIAL_STATE: LicenseReducerState = {
  baseSigner: undefined
}

export const LicenseProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(aircraftProviderReducer, {
    ...INITIAL_STATE
  })
  const { Provider } = LicenseProviderContext

  const setBaseSigner = useCallback(
    (signer?: Readonly<Wallet>) => dispatch({ type: 'SET_BASE_SIGNER', payload: signer }),
    []
  )

  return <Provider value={{ ...state, setBaseSigner }}>{children}</Provider>
}
