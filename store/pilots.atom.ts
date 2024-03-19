import { atom } from 'recoil'
import { IvaoPilot } from 'types'

export const pilotsStore = atom<IvaoPilot[]>({
  key: 'pilotsStore',
  default: []
})
