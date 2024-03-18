import { Wallet } from 'ethers'
import { atom, selector } from 'recoil'

export const walletStore = atom<{
  baseSigner?: Wallet
  smartSigner?: any
  smartAccountAddress?: string
  isLoaded?: boolean
}>({
  key: 'wallet',
  default: {
    isLoaded: false,
    baseSigner: undefined,
    smartSigner: undefined,
    smartAccountAddress: ''
  }
})

export const baseSignerStore = selector({
  key: 'baseSigner',
  get: ({ get }) => {
    const state = get(walletStore)

    return state?.baseSigner
  }
})

export const smartAccountSignerStore = selector({
  key: 'smartSigner',
  get: ({ get }) => {
    const state = get(walletStore)

    return state?.smartSigner
  }
})

export const smartAccountAddressStore = selector({
  key: 'smartAccountAddress',
  get: ({ get }) => {
    const state = get(walletStore)

    return state?.smartAccountAddress
  }
})
