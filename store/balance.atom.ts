import { atom } from 'recoil'
import { BigNumber } from 'bignumber.js'

type TokenBalanceStore = {
  airl?: BigNumber
  airg?: BigNumber
}

export const tokenBalanceStore = atom<TokenBalanceStore>({
  key: 'tokenBalance',
  default: {
    airl: undefined,
    airg: undefined
  }
})
