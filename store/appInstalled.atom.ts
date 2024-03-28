import { atom } from 'recoil'

export const appInstalledStore = atom<boolean>({
  key: 'appInstalledStore',
  default: false
})
