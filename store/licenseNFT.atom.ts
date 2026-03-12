import { NFT } from 'thirdweb'
import { atom } from 'recoil'

export const licenseNftStore = atom<NFT[] | undefined>({
  key: 'licenseNftStore',
  default: undefined
})

export const ownedLicenseNftStore = atom<NFT[] | undefined>({
  key: 'ownedLicenseNftStore',
  default: undefined
})
