/* eslint-disable no-unused-vars */
import BigNumber from 'bignumber.js'

type Actions = GetBalances
type GetBalances = void

export type TokenReducerState = {
  airl?: Readonly<BigNumber>
  airg?: Readonly<BigNumber>
  isLoading: boolean
}

export type TokenContextProps = TokenReducerState & {
  getAirlBalance: () => Promise<BigNumber>
  getAirgBalance: () => Promise<BigNumber>
  getBalances: () => Promise<void>
}

export type TokenReducerHandler = (state: TokenReducerState, action: Actions) => TokenReducerState
