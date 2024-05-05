import { FC, useCallback, useState } from 'react'
import { TokenProviderContext } from './TokenProvider.context'
import { TokenReducerState } from './TokenProvider.types'
import { BigNumber } from 'bignumber.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { tokenBalanceStore } from 'store/balance.atom'
import { publicClient } from 'lib/clientWallet'
import AirlineCoinJSON from 'contracts/abi/AirlineCoin.json'
import AirlineRewardCoinJSON from 'contracts/abi/AirlineRewardCoin.json'
import { COIN_ADDR, REWARD_ADDR } from 'contracts/address/local'

const getAirlBalance = async (smartAccountAddress: string) => {
  const airl = (await publicClient.readContract({
    abi: AirlineCoinJSON.abi,
    address: COIN_ADDR,
    functionName: 'balanceOf',
    args: [smartAccountAddress]
  })) as bigint

  return new BigNumber(airl.toString()).dividedBy(1e18)
}
const getAirgBalance = async (smartAccountAddress: string) => {
  const airg = (await publicClient.readContract({
    abi: AirlineRewardCoinJSON.abi,
    address: REWARD_ADDR,
    functionName: 'balanceOf',
    args: [smartAccountAddress]
  })) as bigint

  return new BigNumber(airg.toString()).dividedBy(1e18)
}

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

    const airl = await getAirlBalance(smartAccountAddress)
    const airg = await getAirgBalance(smartAccountAddress)

    setBalance({ airl, airg })
    // const { tokenBalances } = await alchemy.core.getTokenBalances(smartAccountAddress, [
    //   coinTokenAddress,
    //   rewardTokenAddress
    // ])

    // setBalance({
    //   airl: new BigNumber(tokenBalances[0].tokenBalance || '0').div(1e18),
    //   airg: new BigNumber(tokenBalances[1].tokenBalance || '0').div(1e18)
    // })

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
