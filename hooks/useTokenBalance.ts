import BigNumber from 'bignumber.js'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { useCallback, useEffect, useState } from 'react'
import alchemy from 'lib/alchemy'
import { Hex } from '@alchemy/aa-core'

const useTokenBalance = (contract?: Hex) => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const [balance, setBalance] = useState<BigNumber | undefined>()
  const [isFetched, setIsFetched] = useState<boolean>(false)

  const getBalance = useCallback(async () => {
    if (!contract || !smartAccountAddress) return new BigNumber(0)

    const { tokenBalances } = await alchemy.core.getTokenBalances(smartAccountAddress, [contract])
    const result = new BigNumber(tokenBalances[0].tokenBalance || '0').div(1e18)

    setBalance(result)
    setIsFetched(true)

    return result
  }, [contract, smartAccountAddress])

  useEffect(() => {
    getBalance()
  }, [getBalance])

  return { balance, refetch: getBalance, isFetched }
}

export default useTokenBalance
