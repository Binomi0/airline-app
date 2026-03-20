import { atom } from 'recoil'
import { User } from 'types'

export const userState = atom<User | undefined>({
  key: 'user',
  default: undefined
})
