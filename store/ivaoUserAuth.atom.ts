import { atom } from 'recoil'

// Ivao token
export const ivaoUserAuthStore = atom<string | undefined | null>({
  key: 'ivaoUserAuthStore',
  default: undefined
})
