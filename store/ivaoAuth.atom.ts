import { atom } from 'recoil'

// Ivao token
export const ivaoAuthStore = atom<string | undefined>({
  key: 'ivaoAuthStore',
  default: undefined
})
