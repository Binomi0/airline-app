import React, { FC, useReducer } from 'react'
import tokenProviderReducer from './TokenProvider.reducer'
import { TokenProviderContext } from './TokenProvider.context'
import { TokenReducerState } from './TokenProvider.types'
import { coinTokenAddress, rewardTokenAddress } from 'contracts/address'
import useTokenBalance from 'hooks/useTokenBalance'
import { BigNumber } from 'bignumber.js'

export const INITIAL_STATE: TokenReducerState = {
  airl: new BigNumber(0),
  airg: new BigNumber(0),
  isLoading: false
}

export const TokenProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { balance: airl, refetch: getAirlBalance, isFetched: isAIRLFetched } = useTokenBalance(coinTokenAddress)
  const { balance: airg, refetch: getAirgBalance, isFetched: isAIRGFetched } = useTokenBalance(rewardTokenAddress)
  const [state, dispatch] = useReducer(tokenProviderReducer, { ...INITIAL_STATE, airl, airg })
  const { Provider } = TokenProviderContext

  const setAIRL = React.useCallback((balance: Readonly<BigNumber>) => {
    dispatch({ type: 'SET_AIRL', payload: balance })
  }, [])

  const setAIRG = React.useCallback((balance: Readonly<BigNumber>) => {
    dispatch({ type: 'SET_AIRG', payload: balance })
  }, [])

  const handleSetAIRL = React.useCallback(() => {
    if (!airl) return
    setAIRL(airl)
  }, [airl, setAIRL])

  const handleSetAIRG = React.useCallback(() => {
    if (!airg) return
    setAIRG(airg)
  }, [airg, setAIRG])

  React.useEffect(() => {
    const timer = setInterval(getAirlBalance, 60000)
    return () => clearInterval(timer)
  }, [getAirlBalance])

  React.useEffect(() => {
    const timer = setInterval(getAirgBalance, 60000)
    return () => clearInterval(timer)
  }, [getAirgBalance])

  React.useEffect(() => {
    if (isAIRLFetched) handleSetAIRL()
  }, [handleSetAIRL, isAIRLFetched])

  React.useEffect(() => {
    if (isAIRGFetched) handleSetAIRG()
  }, [handleSetAIRG, isAIRGFetched])

  return <Provider value={{ ...state, getAirlBalance, getAirgBalance, setAIRL, setAIRG }}>{children}</Provider>
}
