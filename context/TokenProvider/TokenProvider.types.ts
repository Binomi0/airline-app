/* eslint-disable no-unused-vars */
import BigNumber from 'bignumber.js'

type Actions = SetAIRLToken | SetAIRGToken
type SetAIRLToken = Readonly<{ type: 'SET_AIRL'; payload: Readonly<BigNumber> }>
type SetAIRGToken = Readonly<{ type: 'SET_AIRG'; payload: Readonly<BigNumber> }>

export type TokenReducerState = {
  airl?: Readonly<BigNumber>
  airg?: Readonly<BigNumber>
  isLoading: boolean
}

export type TokenContextProps = TokenReducerState & {
  setAIRL: (balance: Readonly<BigNumber>) => void
  setAIRG: (balance: Readonly<BigNumber>) => void
}

export type TokenReducerHandler = (state: TokenReducerState, action: Actions) => TokenReducerState
