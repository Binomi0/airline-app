import { atom } from 'recoil'

export const authStore = atom<string | undefined>({
  key: 'authStore',
  default: undefined
})
