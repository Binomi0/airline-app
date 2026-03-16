import { atom } from 'recoil'

type TokenBalanceStore = {
  airl?: bigint
  airg?: bigint
}

export const tokenBalanceStore = atom<TokenBalanceStore>({
  key: 'tokenBalance',
  default: {
    airl: undefined,
    airg: undefined
  }
})
