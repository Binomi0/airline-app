import { ThirdwebClient, Chain } from 'thirdweb'
import { atom, selector } from 'recoil'

export const walletStore = atom<{
  baseSigner?: any // Local private key account
  smartSigner?: any // This will be the Thirdweb Smart Account
  smartAccountAddress?: string
  isLoaded?: boolean
  twClient?: ThirdwebClient
  twChain?: Chain
}>({
  key: 'wallet',
  default: {
    isLoaded: false,
    baseSigner: undefined,
    smartSigner: undefined,
    smartAccountAddress: '',
    twClient: undefined,
    twChain: undefined
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
