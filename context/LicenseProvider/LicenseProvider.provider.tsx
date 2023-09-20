import React, { type FC, useCallback, useReducer } from 'react'
import aircraftProviderReducer from './LicenseProvider.reducer'
import { LicenseProviderContext } from './LicenseProvider.context'
import { LicenseReducerState } from './LicenseProvider.types'
import { nftLicenseTokenAddress } from 'contracts/address'
import { NFT, useContract, useNFTs, useOwnedNFTs } from '@thirdweb-dev/react'
import useAuth from 'hooks/useAuth'

export const INITIAL_STATE: LicenseReducerState = {
  ownedLicenses: [],
  licenses: [],
  isLoading: false
}

export const LicenseProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const { contract } = useContract(nftLicenseTokenAddress)
  const { data: licenses = [], isLoading, isFetched } = useNFTs(contract)
  const {
    data: ownedLicenses = [],
    isFetched: isOwnedFetched,
    refetch: refetchLicenses
  } = useOwnedNFTs(contract, user?.address)
  const [state, dispatch] = useReducer(aircraftProviderReducer, {
    ...INITIAL_STATE,
    licenses,
    ownedLicenses
  })
  const { Provider } = LicenseProviderContext

  const setOwnedLicenses = useCallback(
    (license: Readonly<NFT[]>) => dispatch({ type: 'SET_OWNED_LICENSE', payload: license }),
    []
  )
  const setLicenses = useCallback(
    (licenses: Readonly<NFT[]>) => dispatch({ type: 'SET_LICENSES', payload: licenses }),
    []
  )
  const handleUpdateOwnedLicenses = useCallback(async () => {
    setOwnedLicenses(ownedLicenses)
  }, [ownedLicenses, setOwnedLicenses])

  const handleUpdateLicenses = useCallback(async () => {
    setLicenses(licenses)
  }, [licenses, setLicenses])

  React.useEffect(() => {
    if (isOwnedFetched) handleUpdateOwnedLicenses()
  }, [handleUpdateOwnedLicenses, isOwnedFetched])

  React.useEffect(() => {
    if (isFetched) handleUpdateLicenses()
  }, [handleUpdateLicenses, isFetched])

  return <Provider value={{ ...state, isLoading, setOwnedLicenses, setLicenses, refetchLicenses }}>{children}</Provider>
}
