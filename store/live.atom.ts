import { ILive } from 'models/Live'
import { atom } from 'recoil'

export const liveStore = atom<ILive | undefined | null>({
  key: 'liveStore',
  default: undefined
})
