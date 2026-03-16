/* eslint-disable no-unused-vars */


type Actions = GetBalances
type GetBalances = void

export type TokenReducerState = {
  airl?: Readonly<bigint>
  airg?: Readonly<bigint>
  isLoading: boolean
}

export type TokenContextProps = TokenReducerState & {
  getAirlBalance: () => Promise<void>
  getAirgBalance: () => Promise<void>
  getBalances: () => Promise<void>
}

export type TokenReducerHandler = (state: TokenReducerState, action: Actions) => TokenReducerState
