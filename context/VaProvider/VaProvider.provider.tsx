import React, { FC, useCallback, useReducer } from 'react'
import vaProviderReducer from './VaProvider.reducer'
import { IVAOClients } from './VaProvider.types'
import { VaProviderContext } from './VaProvider.context'
import axios from 'config/axios'
import type {
  Atc,
  Flight
  // IvaoPilot
} from 'types'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { ivaoUserStore } from 'store/ivao-user.atom'

const MIN_IVAO_REQ_DELAY = 20000
export const INITIAL_STATE: IVAOClients = {
  // pilots: [],
  atcs: [],
  towers: [],
  active: undefined,
  flights: {},
  origins: [],
  // filter: [""],
  filter: ['L', 'G']
}

export const VaProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useRecoilValue(userState)
  const ivaoUser = useRecoilValue(ivaoUserStore)
  const [state, dispatch] = useReducer(vaProviderReducer, { ...INITIAL_STATE })
  const { Provider } = VaProviderContext

  // const setPilots = useCallback((pilots: IvaoPilot[]) => {
  //   dispatch({ type: 'SET_PILOTS', payload: pilots })
  // }, [])

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

  // const getPilots = useCallback(async () => {
  //   const response = await axios.get<IvaoPilot[]>('/api/ivao/pilots')

  //   setPilots(response.data)
  // }, [setPilots])

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
      console.error('getIVAOData', err)
    }
  }, [])

  const startTimers = useCallback(() => {
    const ivaoTimer = setInterval(getIVAOData, MIN_IVAO_REQ_DELAY)
    // const pilotsTimer = setInterval(getPilots, MIN_IVAO_REQ_DELAY / 2)

    return () => {
      clearInterval(ivaoTimer)
      // clearInterval(pilotsTimer)
    }
  }, [
    getIVAOData
    //  getPilots
  ])

  const initIvaoData = useCallback(() => {
    if (!ivaoUser) return
    getAtcs()
    getTowers()
    // getPilots()
    getFlights()
    getIVAOData()
    startTimers()
  }, [ivaoUser, getAtcs, getTowers, getFlights, getIVAOData, startTimers])

  return (
    <Provider
      value={{
        // pilots: state.pilots,
        atcs: state.atcs,
        towers: state.towers,
        active: state.active,
        flights: state.flights,
        filter: state.filter,
        origins: state.origins,
        setFilter,
        initIvaoData
      }}
    >
      {children}
    </Provider>
  )
}
