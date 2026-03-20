import { atom } from 'recoil'
import { IvaoPilot } from 'types'

export const pilotStore = atom<IvaoPilot[]>({
  key: 'pilotStore',
  default: []
})
