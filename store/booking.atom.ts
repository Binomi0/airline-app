import { atom } from 'recoil'

// TODO: what is this for ? XDD
export const bookingStore = atom<boolean>({
  key: 'bookingStore',
  default: false
})
