import React, { FC, useCallback, useReducer } from 'react'
import aircraftProviderReducer from './AircraftProvider.reducer'
import { AircraftProviderContext } from './AircraftProvider.context'
import { AircraftReducerState } from './AircraftProvider.types'
import { Wallet } from 'ethers'

export const INITIAL_STATE: AircraftReducerState = {
  baseSigner: undefined
}

export const AircraftProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(aircraftProviderReducer, {
    ...INITIAL_STATE
  })
  const { Provider } = AircraftProviderContext

  const setBaseSigner = useCallback(
    (signer?: Readonly<Wallet>) => dispatch({ type: 'SET_BASE_SIGNER', payload: signer }),
    []
  )

  return <Provider value={{ ...state, setBaseSigner }}>{children}</Provider>
}
