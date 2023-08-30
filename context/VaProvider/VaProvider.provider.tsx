import React, { FC, useCallback, useEffect, useReducer } from 'react'
import vaProviderReducer from './VaProvider.reducer'
import { IVAOClients } from './VaProvider.types'
import { VaProviderContext } from './VaProvider.context'
import axios from 'config/axios'
import type { Atc, FRoute, Flight, IvaoPilot } from 'types'

export const INITIAL_STATE: IVAOClients = {
  pilots: [],
  atcs: [],
  active: undefined,
  flights: {},
  origins: [],
  // filter: [""],
  filter: ['LE', 'GC']
}

const reduceOthers = (origin: string, others: Atc[]): FRoute[] =>
  others.reduce((acc: FRoute[], curr: Atc) => {
    if (acc.some((ac) => ac.destination === curr.callsign.split('_')[0])) {
      return acc
    }
    return [
      ...acc,
      {
        origin,
        destination: curr.callsign.split('_')[0]
      }
    ]
  }, [] as FRoute[])

export const VaProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(vaProviderReducer, { ...INITIAL_STATE })
  const { Provider } = VaProviderContext

  const setFlights = useCallback(
    (atcs: Readonly<Atc[]>) => {
      const towers = atcs.filter(
        (a) => a.callsign.includes('TWR') && state.filter.some((i) => a.callsign.startsWith(i))
      )

      const flights: Flight = towers.reduce((acc: Flight, curr: Atc) => {
        const others: Atc[] = towers.filter((t) => {
          return t.id !== curr.id && t.callsign.split('_')[0] !== curr.callsign.split('_')[0]
        })

        const origin = curr.callsign.split('_')[0]
        if (acc[origin]) {
          return acc
        }
        return {
          ...acc,
          [origin]: reduceOthers(origin, others)
        }
      }, {})

      dispatch({ type: 'SET_FLIGHTS', payload: flights })
    },
    [state.filter]
  )

  const setClients = useCallback((clients: Readonly<IVAOClients>) => {
    dispatch({ type: 'SET_CLIENTS', payload: clients })
  }, [])

  const setCurrentPilot = useCallback(
    (pilot?: Readonly<IvaoPilot>) => dispatch({ type: 'SET_CURRENT_PILOT', payload: pilot }),
    []
  )

  const setFilter = useCallback((value: string) => {
    dispatch({ type: 'SET_FILTER', payload: value })
  }, [])

  const getClients = useCallback(async () => {
    const response = await axios.get('/api/ivao/whazzup')

    setClients(response.data)
    setFlights(response.data.atcs as Readonly<Atc[]>)
  }, [setClients, setFlights])

  useEffect(() => {
    const timer = setInterval(getClients, 15000)
    return () => clearInterval(timer)
  }, [getClients])

  useEffect(() => {
    getClients()
  }, [getClients])
  return (
    <Provider
      value={{
        pilots: state.pilots,
        atcs: state.atcs,
        active: state.active,
        flights: state.flights,
        filter: state.filter,
        origins: state.origins,
        setFlights,
        setFilter,
        setCurrentPilot,
        setClients
      }}
    >
      {children}
    </Provider>
  )
}
