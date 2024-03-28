import { atom } from 'recoil'

export const bookingStore = atom<boolean>({
  key: 'bookingStore',
  default: false
})
