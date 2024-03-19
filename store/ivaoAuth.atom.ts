import { atom } from 'recoil'

export const ivaoAuthStore = atom<string | undefined>({
  key: 'ivaoAuthStore',
  default: undefined
})
