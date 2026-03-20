import { atom } from 'recoil'
import { IvaoUser } from 'types'

// Ivao user
export const ivaoUserStore = atom<IvaoUser | undefined>({
  key: 'ivaoUserStore',
  default: undefined
})
