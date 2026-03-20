import React, { FC, useCallback, useState } from 'react'
import { TokenProviderContext } from './TokenProvider.context'
import { TokenReducerState } from './TokenProvider.types'
import { coinTokenAddress, rewardTokenAddress } from 'contracts/address'
import axios from 'config/axios'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { tokenBalanceStore } from 'store/balance.atom'

export const INITIAL_STATE: TokenReducerState = {
  airl: 0n,
  airg: 0n,
  isLoading: false
}

export const TokenProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const setBalance = useSetRecoilState(tokenBalanceStore)
  const [isFetched, setIsFetched] = useState<boolean>(false)

  const { Provider } = TokenProviderContext

  const getBalance = useCallback(async () => {
    if (!smartAccountAddress) return

    const { data } = await axios.post('/api/token/balance', {
      address: smartAccountAddress,
      tokens: [coinTokenAddress, rewardTokenAddress]
    })

    const { tokenBalances } = data

    setBalance({
      airl: BigInt(tokenBalances[0].tokenBalance || '0'),
      airg: BigInt(tokenBalances[1].tokenBalance || '0')
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
