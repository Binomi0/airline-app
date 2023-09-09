import React, { FC, useCallback, useReducer } from 'react'
import aircraftProviderReducer from './AircraftProvider.reducer'
import { AircraftProviderContext } from './AircraftProvider.context'
import { AircraftReducerState } from './AircraftProvider.types'
import { NFT } from '@thirdweb-dev/sdk'
import { useContract, useNFTs, useOwnedNFTs } from '@thirdweb-dev/react'
import { nftAircraftTokenAddress } from 'contracts/address'
import useAuth from 'hooks/useAuth'

export const INITIAL_STATE: AircraftReducerState = {
  aircrafts: [],
  ownedAircrafts: [],
  isLoading: false
}

export const AircraftProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data: aircrafts = [], isLoading: loadingNFTs, isFetched } = useNFTs(contract)
  const {
    data: ownedAircrafts = [],
    isLoading: loadingOwnNFTs,
    isFetched: isOwnedFetched
  } = useOwnedNFTs(contract, user?.address)
  const [state, dispatch] = useReducer(aircraftProviderReducer, {
    ...INITIAL_STATE,
    aircrafts,
    ownedAircrafts
  })
  const { Provider } = AircraftProviderContext

  const isLoading = React.useMemo(() => loadingNFTs || loadingOwnNFTs, [loadingNFTs, loadingOwnNFTs])

  const setOwnedAircrafts = useCallback(
    (owned: Readonly<NFT[]>) => dispatch({ type: 'SET_OWNED_AIRCRAFTS', payload: owned }),
    []
  )
  const setAircrafts = useCallback((list: Readonly<NFT[]>) => dispatch({ type: 'SET_AIRCRAFTS', payload: list }), [])

  const handleUpdateOwnedAircrafts = useCallback(async () => {
    setOwnedAircrafts(ownedAircrafts)
  }, [ownedAircrafts, setOwnedAircrafts])

  const handleUpdateAircrafts = useCallback(async () => {
    setAircrafts(aircrafts)
  }, [aircrafts, setAircrafts])

  React.useEffect(() => {
    if (isOwnedFetched) handleUpdateOwnedAircrafts()
  }, [handleUpdateOwnedAircrafts, isOwnedFetched])

  React.useEffect(() => {
    if (isFetched) handleUpdateAircrafts()
  }, [handleUpdateAircrafts, isFetched])

  return <Provider value={{ ...state, isLoading, setOwnedAircrafts, setAircrafts }}>{children}</Provider>
}
