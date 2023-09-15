import React, { FC, useCallback } from 'react'
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
  const { balance: airl, refetch: getAirlBalance, isFetched: airlFetched } = useTokenBalance(coinTokenAddress)
  const { balance: airg, refetch: getAirgBalance, isFetched: airgFetched } = useTokenBalance(rewardTokenAddress)
  const { Provider } = TokenProviderContext
  const isLoading = airlFetched && airgFetched

  const getBalances = useCallback(() => {
    Promise.all([getAirlBalance, getAirgBalance])
  }, [getAirgBalance, getAirlBalance])

  React.useEffect(() => {
    getAirlBalance()
  }, [getAirlBalance])

  React.useEffect(() => {
    getAirgBalance()
  }, [getAirgBalance])

  return <Provider value={{ airl, airg, getAirlBalance, getAirgBalance, getBalances, isLoading }}>{children}</Provider>
}
