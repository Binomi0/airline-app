import { atom } from 'recoil'
import { INft } from 'models/Nft'

export const licenseNftStore = atom<INft[] | undefined>({
  key: 'licenseNftStore',
  default: undefined
})

export const ownedLicenseNftStore = atom<INft[] | undefined>({
  key: 'ownedLicenseNftStore',
  default: undefined
})
