import React, { FC, useReducer } from 'react'
import tokenProviderReducer from './TokenProvider.reducer'
import { TokenProviderContext } from './TokenProvider.context'
import { TokenReducerState } from './TokenProvider.types'
import { coinTokenAddress, rewardTokenAddress } from 'contracts/address'
import useTokenBalance from 'hooks/useTokenBalance'
import BigNumber from 'bignumber.js'

export const INITIAL_STATE: TokenReducerState = {
  airl: new BigNumber(0),
  airg: new BigNumber(0),
  isLoading: false
}

export const TokenProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { balance: airl } = useTokenBalance(coinTokenAddress)
  const { balance: airg } = useTokenBalance(rewardTokenAddress)
  const [state, dispatch] = useReducer(tokenProviderReducer, {
    ...INITIAL_STATE,
    airl,
    airg
  })
  const { Provider } = TokenProviderContext

  const setAIRL = React.useCallback((balance: Readonly<BigNumber>) => {
    dispatch({ type: 'SET_AIRL', payload: balance })
  }, [])

  const setAIRG = React.useCallback((balance: Readonly<BigNumber>) => {
    dispatch({ type: 'SET_AIRG', payload: balance })
  }, [])

  return <Provider value={{ ...state, setAIRL, setAIRG }}>{children}</Provider>
}
