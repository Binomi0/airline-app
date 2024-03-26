import React, { FC, useCallback, useState } from 'react'
import { TokenProviderContext } from './TokenProvider.context'
import { TokenReducerState } from './TokenProvider.types'
import { coinTokenAddress, rewardTokenAddress } from 'contracts/address'
import { BigNumber } from 'bignumber.js'
import alchemy from 'lib/alchemy'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { tokenBalanceStore } from 'store/balance.atom'

export const INITIAL_STATE: TokenReducerState = {
  airl: new BigNumber(0),
  airg: new BigNumber(0),
  isLoading: false
}

export const TokenProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const setBalance = useSetRecoilState(tokenBalanceStore)
  const [isFetched, setIsFetched] = useState<boolean>(false)

  const { Provider } = TokenProviderContext

  const getBalance = useCallback(async () => {
    if (!smartAccountAddress) return

    const { tokenBalances } = await alchemy.core.getTokenBalances(smartAccountAddress, [
      coinTokenAddress,
      rewardTokenAddress
    ])

    setBalance({
      airl: new BigNumber(tokenBalances[0].tokenBalance || '0').div(1e18),
      airg: new BigNumber(tokenBalances[1].tokenBalance || '0').div(1e18)
    })

    setIsFetched(true)
  }, [setBalance, smartAccountAddress])

  return (
    <Provider
      value={{ getAirlBalance: getBalance, getAirgBalance: getBalance, getBalances: getBalance, isLoading: !isFetched }}
    >
      {children}
    </Provider>
  )
}
