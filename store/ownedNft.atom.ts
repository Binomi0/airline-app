import { AlchemyOwnedNft } from 'types/alchemy'
import { atom } from 'recoil'

export const ownedNftStore = atom<AlchemyOwnedNft[]>({
  key: 'ownedNftStore',
  default: []
})
