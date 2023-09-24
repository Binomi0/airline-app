import React, { type FC } from 'react'
import { LicenseProviderContext } from './LicenseProvider.context'
import { LicenseReducerState } from './LicenseProvider.types'
import { nftLicenseTokenAddress } from 'contracts/address'
import { useContract, useNFTs, useOwnedNFTs } from '@thirdweb-dev/react'
import useAuth from 'hooks/useAuth'

export const INITIAL_STATE: LicenseReducerState = {
  ownedLicenses: [],
  licenses: [],
  isLoading: false
}

export const LicenseProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const { contract } = useContract(nftLicenseTokenAddress)
  const { data: licenses = [], isLoading } = useNFTs(contract)
  const { data: owned = [], refetch } = useOwnedNFTs(contract, user?.address)
  const { Provider } = LicenseProviderContext

  return <Provider value={{ ownedLicenses: owned, licenses, isLoading, refetchLicenses: refetch }}>{children}</Provider>
}
