import { atom } from 'recoil'

export const authState = atom<string | undefined>({
  key: 'auth',
  default: undefined
})
