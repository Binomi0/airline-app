import { atom } from 'recoil'

// Ivao token
export const ivaoAuthStore = atom<string | undefined | null>({
  key: 'ivaoAuthStore',
  default: undefined
})
