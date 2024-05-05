import React, { useCallback, useReducer } from 'react'
import aircraftProviderReducer from './AircraftProvider.reducer'
import { AircraftProviderContext } from './AircraftProvider.context'
import { AircraftReducerState } from './AircraftProvider.types'
import { NFT } from '@thirdweb-dev/sdk'
import { useContract, useNFTs, useOwnedNFTs } from '@thirdweb-dev/react'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { Nft } from 'alchemy-sdk'

export const INITIAL_STATE: AircraftReducerState = {
  aircrafts: [],
  ownedAircrafts: [],
  isLoading: false
}

interface Props {
  children: React.ReactNode
  nfts: Nft[]
}

export const AircraftProvider = ({ children, nfts }: Props) => {
  const user = useRecoilValue(userState)
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data: aircrafts = [], isLoading, isFetched, refetch: refetchAircrafts } = useNFTs(contract)

  const { data: ownedAircrafts = [] } = useOwnedNFTs(contract, user?.address)
  const [state, dispatch] = useReducer(aircraftProviderReducer, {
    ...INITIAL_STATE,
    aircrafts,
    ownedAircrafts
  })
  const { Provider } = AircraftProviderContext

  const setOwnedAircrafts = useCallback((owned: NFT[]) => dispatch({ type: 'SET_OWNED_AIRCRAFTS', payload: owned }), [])
  const setAircrafts = useCallback((list: NFT[]) => dispatch({ type: 'SET_AIRCRAFTS', payload: list }), [])

  // const handleUpdateOwnedAircrafts = useCallback(async () => {
  //   setOwnedAircrafts(ownedAircrafts)
  // }, [ownedAircrafts, setOwnedAircrafts])

  // React.useEffect(() => {
  //   if (isFetched) handleUpdateOwnedAircrafts()
  // }, [handleUpdateOwnedAircrafts, isFetched])

  React.useEffect(() => {
    console.log({ nfts })
  }, [nfts])

  return (
    <Provider value={{ ...state, isLoading, setOwnedAircrafts, setAircrafts, refetchAircrafts }}>{children}</Provider>
  )
}
