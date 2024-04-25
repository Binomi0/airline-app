import { NFT } from '@thirdweb-dev/sdk'
import { atom } from 'recoil'

export const aircraftNftStore = atom<NFT[] | undefined>({
  key: 'aircraftNftStore',
  default: undefined
})

export const ownedAircraftNftStore = atom<NFT[] | undefined>({
  key: 'ownedAircraftNftStore',
  default: undefined
})
