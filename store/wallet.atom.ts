import { ThirdwebClient, Chain, Hex } from 'thirdweb'
import { atom, selector } from 'recoil'
import { twClient, activeChain } from 'config'

export const walletStore = atom<{
  baseSigner?: any // Local private key account
  smartSigner?: any // This will be the Thirdweb Smart Account
  smartAccountAddress?: Hex
  isLoaded?: boolean
  isLocked?: boolean
  isCloudSynced?: boolean
  twClient?: ThirdwebClient
  twChain?: Chain
}>({
  key: 'wallet',
  default: {
    isLoaded: false,
    isLocked: true,
    isCloudSynced: false,
    baseSigner: undefined,
    smartSigner: undefined,
    smartAccountAddress: undefined,
    twClient,
    twChain: activeChain
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
