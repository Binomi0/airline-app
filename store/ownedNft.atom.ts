import { Nft } from 'alchemy-sdk'
import { atom } from 'recoil'

export const ownedNftStore = atom<Nft[]>({
  key: 'ownedNftStore',
  default: []
})
