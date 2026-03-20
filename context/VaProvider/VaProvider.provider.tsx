import { useRouter } from 'next/router'
import React, { type FC, startTransition, useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { getApi } from 'lib/api'
import type { Atc, Flight } from 'types'
// import { ivaoUserStore } from 'store/ivao-user.atom'
import { ivaoUserAuthStore } from 'store/ivaoUserAuth.atom'
import { authStore } from 'store/auth.atom'
import vaProviderReducer from './VaProvider.reducer'
import { IVAOClients } from './VaProvider.types'
import { VaProviderContext } from './VaProvider.context'
import nextApiInstance, { ivaoInstance } from 'config/axios'

const MIN_IVAO_REQ_DELAY = 1 * 60 * 1000
const IVAO_ACTIVE_ROUTES = ['/missions', '/live', '/ivao', '/map', '/operations']

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
  const router = useRouter()
  // const user = useRecoilValue(userState)
  // const ivaoUser = useRecoilValue(ivaoUserStore)
  const ivaoToken = useRecoilValue(ivaoUserAuthStore)
  const setIvaoToken = useSetRecoilState(ivaoUserAuthStore)
  const authToken = useRecoilValue(authStore)

  React.useEffect(() => {
    if (ivaoToken) {
      ivaoInstance.defaults.headers['x-ivao-token'] = `Bearer ${ivaoToken}`
      nextApiInstance.defaults.headers['x-ivao-token'] = `Bearer ${ivaoToken}`
    }
  }, [ivaoToken])

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

  const setFlights = useCallback((flights: Readonly<Flight>) => {
    dispatch({ type: 'SET_FLIGHTS', payload: flights })
  }, [])

  const setFilter = useCallback((value: string) => {
    dispatch({ type: 'SET_FILTER', payload: value })
  }, [])

  const getAtcs = useCallback(async () => {
    setIsLoading((s) => s + 1)
    try {
      const response = await nextApiInstance.get<Atc[]>('api/ivao/atc/tower')

      startTransition(() => {
        setAtcs(response.data ?? [])
        setIsLoading((s) => s - 1)
      })
    } catch {
      setIsLoading((s) => s - 1)
    }
  }, [setAtcs])

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
      // await getApi('/api/ivao/whazzup')
    } catch (err) {
      console.error('getIVAOData', err)
    }
  }, [])

  React.useEffect(() => {
    // Only start sync if we have an app token (logged in)
    if (!authToken) return

    // Route-based guard: only sync on specific pages
    const isAllowedRoute = IVAO_ACTIVE_ROUTES.some((route) => router.pathname.startsWith(route))
    if (!isAllowedRoute) return

    const atcTimer = setInterval(() => getAtcs(), MIN_IVAO_REQ_DELAY)
    const ivaoTimer = setInterval(() => getIVAOData(), MIN_IVAO_REQ_DELAY)
    // const pilotsTimer = setInterval(getPilots, MIN_IVAO_REQ_DELAY / 2)

    return () => {
      clearInterval(atcTimer)
      clearInterval(ivaoTimer)
    }
  }, [getAtcs, getIVAOData, authToken, router.pathname])

  const initIvaoData = useCallback(() => {
    // Manual trigger for first load
    getAtcs()
    getIVAOData()
  }, [getAtcs, getIVAOData])

  const initIvaoAuth = useCallback(() => {
    if (isAuthorizing.current) return
    isAuthorizing.current = true
    nextApiInstance
      .get('/api/ivao/oauth')
      .then((response) => {
        ivaoInstance.defaults.headers['x-ivao-token'] = `Bearer ${response.data}`
        nextApiInstance.defaults.headers['x-ivao-token'] = `Bearer ${response.data}`
        setIvaoToken(response.data)
        getAtcs()
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
      getFlights,
      initIvaoData,
      initIvaoAuth
    }),
    [state, isLoading, setFilter, getFlights, initIvaoData, initIvaoAuth]
  )

  return <Provider value={contextValue}>{children}</Provider>
}
