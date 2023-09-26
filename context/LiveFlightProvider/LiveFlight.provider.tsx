import React, { FC, useCallback, useEffect, useReducer } from 'react'
import liveFlightProviderReducer from './LiveFlight.reducer'
import { LiveFlightProviderContext } from './LiveFlight.context'
import type { IvaoPilot } from 'types'
import { LiveFlightReducerState } from './LiveFlight.types'
import { useVaProviderContext } from 'context/VaProvider'
import useLive from 'hooks/useLive'

export const INITIAL_STATE: LiveFlightReducerState = {
  pilot: undefined
}

export const LiveFlightsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { live, getLive } = useLive()
  const { pilots } = useVaProviderContext()
  const [state, dispatch] = useReducer(liveFlightProviderReducer, { ...INITIAL_STATE })
  const { Provider } = LiveFlightProviderContext

  const setPilot = useCallback((pilot?: Readonly<IvaoPilot>) => {
    dispatch({ type: 'SET_PILOT', payload: pilot })
  }, [])

  useEffect(() => {
    if (pilots.length && !!live) {
      const current = pilots.find((pilot) => pilot.callsign === live.callsign)
      if (current) {
        setPilot(current)
      }
    } else if (!live) {
      setPilot()
    }
  }, [live, pilots, setPilot])

  return (
    <Provider
      value={{
        pilot: state.pilot,
        live,
        setPilot,
        getLive
      }}
    >
      {children}
    </Provider>
  )
}
