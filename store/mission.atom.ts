import { atom } from 'recoil'
import { Mission } from 'types'

export const missionStore = atom<Mission | undefined>({
  key: 'missionStore',
  default: undefined
})
