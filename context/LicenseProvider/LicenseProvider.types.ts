/* eslint-disable no-unused-vars */
import { NFT } from '@thirdweb-dev/sdk'

type Actions = SetOwnedLicenses | SetLicenses
type SetOwnedLicenses = Readonly<{ type: 'SET_OWNED_LICENSE'; payload: Readonly<NFT[]> }>
type SetLicenses = Readonly<{ type: 'SET_LICENSES'; payload: Readonly<NFT[]> }>

export type LicenseReducerState = {
  ownedLicenses: Readonly<NFT[]>
  licenses: Readonly<NFT[]>
  isLoading: boolean
}

export type LicenseContextProps = LicenseReducerState & {
  setOwnedLicenses: (license: Readonly<NFT[]>) => void
  setLicenses: (licenses: Readonly<NFT[]>) => void
  refetchLicenses: () => void
}

export type LicenseReducerHandler = (state: LicenseReducerState, action: Actions) => LicenseReducerState
