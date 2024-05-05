import { NFT } from '@thirdweb-dev/sdk'
import { atom } from 'recoil'

export const nftLicenseStore = atom<NFT[]>({
  key: 'nftLicenseStore',
  default: []
})
export const ownedNftLicenseStore = atom<NFT[]>({
  key: 'ownedNftLicenseStore',
  default: []
})
