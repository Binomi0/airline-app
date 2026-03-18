import axios from 'axios'
import React, { type FC, startTransition, useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { getApi } from 'lib/api'
import type { Atc } from 'types'
// import { ivaoUserStore } from 'store/ivao-user.atom'
import { ivaoUserAuthStore } from 'store/ivaoUserAuth.atom'
import vaProviderReducer from './VaProvider.reducer'
import { IVAOClients } from './VaProvider.types'
import { VaProviderContext } from './VaProvider.context'

const MIN_IVAO_REQ_DELAY = 30000
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
  // const ivaoUser = useRecoilValue(ivaoUserStore)
  const ivaoToken = useRecoilValue(ivaoUserAuthStore)
  const setIvaoToken = useSetRecoilState(ivaoUserAuthStore)

  const [state, dispatch] = useReducer(vaProviderReducer, INITIAL_STATE)
  const [isLoading, setIsLoading] = useState(0)
  const isAuthorizing = useRef(false)
  const { Provider } = VaProviderContext

  // const setPilots = useCallback((pilots: IvaoPilot[]) => {
  //   dispatch({ type: 'SET_PILOTS', payload: pilots })
  // }, [])

  const setAtcs = useCallback((atcs: Atc[]) => {
    dispatch({ type: 'SET_ATCS', payload: atcs })
  }, [])

  // const setTowers = useCallback((towers: Readonly<Atc[]>) => {
  //   dispatch({ type: 'SET_TOWERS', payload: towers })
  // }, [])

  // const setFlights = useCallback((flights: Readonly<Flight>) => {
  //   dispatch({ type: 'SET_FLIGHTS', payload: flights })
  // }, [])

  const setFilter = useCallback((value: string) => {
    dispatch({ type: 'SET_FILTER', payload: value })
  }, [])

  const getAtcs = useCallback(
    async (_token?: string) => {
      const tokenToUse = _token || ivaoToken
      if (!tokenToUse) return
      console.log({ _token: tokenToUse })

      setIsLoading((s) => s + 1)
      try {
        const response = await axios.get<Atc[]>('api/ivao/atc/tower', {
          headers: {
            Authorization: `Bearer ${tokenToUse}`
          }
        })

        startTransition(() => {
          setAtcs(response.data ?? [])
          setIsLoading((s) => s - 1)
        })
      } catch {
        setIsLoading((s) => s - 1)
      }
    },
    [ivaoToken, setAtcs]
  )

  // const getPilots = useCallback(async () => {
  //   const response = await axios.get<IvaoPilot[]>('/api/ivao/pilots')

  //   setPilots(response.data)
  // }, [setPilots])

  // const getTowers = useCallback(async () => {
  //   setIsLoading((s) => s + 1)
  //   const towers = await getApi<Atc[]>('/api/ivao/towers')

  //   startTransition(() => {
  //     setTowers(towers ?? [])
  //     setIsLoading((s) => s - 1)
  //   })
  // }, [setTowers])

  // const getFlights = useCallback(async () => {
  //   setIsLoading((s) => s + 1)
  //   const flights = await getApi<Flight>('/api/ivao/flights')

  //   startTransition(() => {
  //     setFlights(flights ?? {})
  //     setIsLoading((s) => s - 1)
  //   })
  // }, [setFlights])

  const getIVAOData = useCallback(async () => {
    try {
      await getApi('/api/ivao/whazzup')
    } catch (err) {
      console.error('getIVAOData', err)
    }
  }, [])

  React.useEffect(() => {
    // Only start sync if we have a token or don't need one for whazzup
    const atcTimer = setInterval(() => getAtcs(), MIN_IVAO_REQ_DELAY)
    const ivaoTimer = setInterval(() => getIVAOData(), MIN_IVAO_REQ_DELAY)
    // const pilotsTimer = setInterval(getPilots, MIN_IVAO_REQ_DELAY / 2)

    return () => {
      clearInterval(atcTimer)
      clearInterval(ivaoTimer)
    }
  }, [getAtcs, getIVAOData])

  const initIvaoData = useCallback(() => {
    // Manual trigger for first load
    getAtcs()
    getIVAOData()
  }, [getAtcs, getIVAOData])

  const initIvaoAuth = useCallback(() => {
    if (isAuthorizing.current) return
    isAuthorizing.current = true
    axios
      .get('/api/ivao/oauth')
      .then((response) => {
        getAtcs(response.data)
        axios.defaults.headers['x-ivao-token'] = `Bearer ${response.data}`
        setIvaoToken(response.data)
      })
      .catch((error) => {
        console.log('initIvaoAuth error =>', error)
      })
      .finally(() => {
        isAuthorizing.current = false
      })
  }, [getAtcs, setIvaoToken])

  const contextValue = useMemo(
    () => ({
      // pilots: state.pilots,
      atcs: state.atcs,
      towers: state.towers,
      active: state.active,
      flights: state.flights,
      filter: state.filter,
      origins: state.origins,
      isLoading: Boolean(isLoading),
      setFilter,
      initIvaoData,
      initIvaoAuth
    }),
    [state, isLoading, setFilter, initIvaoData, initIvaoAuth]
  )

  return <Provider value={contextValue}>{children}</Provider>
}
