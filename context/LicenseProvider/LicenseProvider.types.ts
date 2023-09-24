/* eslint-disable no-unused-vars */
import { NFT } from '@thirdweb-dev/sdk'

type Actions = any

export type LicenseReducerState = {
  ownedLicenses: Readonly<NFT[]>
  licenses: Readonly<NFT[]>
  isLoading: boolean
}

export type LicenseContextProps = LicenseReducerState & {
  refetchLicenses: () => void
}

export type LicenseReducerHandler = (state: LicenseReducerState, action: Actions) => LicenseReducerState
