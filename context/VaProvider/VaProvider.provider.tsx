import React, { FC, startTransition, useCallback, useReducer, useState } from 'react'
import vaProviderReducer from './VaProvider.reducer'
import { IVAOClients } from './VaProvider.types'
import { VaProviderContext } from './VaProvider.context'
import type {
  Atc,
  Flight
  // IvaoPilot
} from 'types'
import { useRecoilValue } from 'recoil'
// import { userState } from 'store/user.atom'
import { ivaoUserStore } from 'store/ivao-user.atom'
import { getApi } from 'lib/api'

const MIN_IVAO_REQ_DELAY = 20000
export const INITIAL_STATE: IVAOClients = {
  // pilots: [],
  atcs: [],
  towers: [],
  active: undefined,
  flights: {},
  origins: [],
  // filter: [""],
  filter: ['L', 'G'],
  isLoading: false
}

export const VaProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  // const user = useRecoilValue(userState)
  const ivaoUser = useRecoilValue(ivaoUserStore)
  const [state, dispatch] = useReducer(vaProviderReducer, { ...INITIAL_STATE })
  const [isLoading, setIsLoading] = useState(0)
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
    setIsLoading((s) => s + 1)
    const atcs = await getApi<Atc[]>('/api/ivao/atcs')

    startTransition(() => {
      setAtcs(atcs ?? [])
      setIsLoading((s) => s - 1)
    })
  }, [setAtcs])

  // const getPilots = useCallback(async () => {
  //   const response = await axios.get<IvaoPilot[]>('/api/ivao/pilots')

  //   setPilots(response.data)
  // }, [setPilots])

  const getTowers = useCallback(async () => {
    setIsLoading((s) => s + 1)
    const towers = await getApi<Atc[]>('/api/ivao/towers')

    startTransition(() => {
      setTowers(towers ?? [])
      setIsLoading((s) => s - 1)
    })
  }, [setTowers])

  const getFlights = useCallback(async () => {
    setIsLoading((s) => s + 1)
    const flights = await getApi<Flight>('/api/ivao/flights')

    startTransition(() => {
      setFlights(flights ?? {})
      setIsLoading((s) => s - 1)
    })
  }, [setFlights])

  const getIVAOData = useCallback(async () => {
    try {
      await getApi('/api/ivao/whazzup')
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
        isLoading: Boolean(isLoading),
        setFilter,
        initIvaoData
      }}
    >
      {children}
    </Provider>
  )
}
