import { atom } from 'recoil'

export const authStore = atom<string | undefined>({
  key: 'auth',
  default: undefined
})
