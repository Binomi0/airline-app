import React, { FC, useCallback, useEffect, useReducer } from 'react'
import vaProviderReducer from './VaProvider.reducer'
import { IVAOClients } from './VaProvider.types'
import { VaProviderContext } from './VaProvider.context'
import axios from 'config/axios'
import type { Atc, Flight, IvaoPilot } from 'types'
import useAuth from 'hooks/useAuth'

export const INITIAL_STATE: IVAOClients = {
  pilots: [],
  atcs: [],
  towers: [],
  active: undefined,
  flights: {},
  origins: [],
  // filter: [""],
  filter: ['L', 'G']
}

export const VaProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(vaProviderReducer, { ...INITIAL_STATE })
  const { Provider } = VaProviderContext

  const setPilots = useCallback((pilots: IvaoPilot[]) => {
    dispatch({ type: 'SET_PILOTS', payload: pilots })
  }, [])

  const setAtcs = useCallback((atcs: Atc[]) => {
    dispatch({ type: 'SET_ATCS', payload: atcs })
  }, [])

  const setTowers = useCallback((towers: Readonly<Atc[]>) => {
    dispatch({ type: 'SET_TOWERS', payload: towers })
  }, [])

  const setFlights = useCallback((flights: Readonly<Flight>) => {
    dispatch({ type: 'SET_FLIGHTS', payload: flights })
  }, [])

  const setFilter = useCallback((value: string) => {
    dispatch({ type: 'SET_FILTER', payload: value })
  }, [])

  const getAtcs = useCallback(async () => {
    const responseAtcs = await axios.get<Atc[]>('/api/ivao/atcs')

    setAtcs(responseAtcs.data)
  }, [setAtcs])

  const getPilots = useCallback(async () => {
    const response = await axios.get<IvaoPilot[]>('/api/ivao/pilots')

    setPilots(response.data)
  }, [setPilots])

  const getTowers = useCallback(async () => {
    const response = await axios.get<Atc[]>('/api/ivao/towers')

    setTowers(response.data)
  }, [setTowers])

  const getFlights = useCallback(async () => {
    const response = await axios.get<Flight>('/api/ivao/flights')

    setFlights(response.data)
  }, [setFlights])

  const getIVAOData = useCallback(async () => {
    try {
      await axios.get('/api/ivao/whazzup')
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    const timer = setInterval(getIVAOData, 20000)
    return () => clearInterval(timer)
  }, [getIVAOData, user])

  useEffect(() => {
    if (!user) return
    const timer = setInterval(getPilots, 10000)
    return () => clearInterval(timer)
  }, [getPilots, user])

  useEffect(() => {
    if (!user) return
    getAtcs()
    getTowers()
    getFlights()
  }, [getAtcs, getFlights, getTowers, user])

  return (
    <Provider
      value={{
        pilots: state.pilots,
        atcs: state.atcs,
        towers: state.towers,
        active: state.active,
        flights: state.flights,
        filter: state.filter,
        origins: state.origins,
        setFilter
      }}
    >
      {children}
    </Provider>
  )
}
