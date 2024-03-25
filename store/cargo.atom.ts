import { atom } from 'recoil'
import { Cargo } from 'types'

export const cargoStore = atom<Cargo | undefined>({
  key: 'cargoStore',
  default: undefined
})
