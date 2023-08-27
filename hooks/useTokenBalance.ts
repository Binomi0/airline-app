import axios from 'config/axios'
import BigNumber from 'bignumber.js'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { useCallback, useEffect, useState } from 'react'

const ZERO = new BigNumber(0)
const useTokenBalance = (token?: string) => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const [balance, setBalance] = useState<BigNumber>(ZERO)

  const getBalance = useCallback(async () => {
    if (!smartAccountAddress) {
      setBalance(ZERO)
      return ZERO
    }

    try {
      const response = await axios.post('/api/token/balance', { address: smartAccountAddress, token })
      const [balance] = response.data.tokenBalances
      const balanceBigNumber = new BigNumber(balance.tokenBalance).div(1e18)

      setBalance(balanceBigNumber)
      return balanceBigNumber
    } catch (error) {
      console.error(error)
      setBalance(ZERO)
      return ZERO
    }
  }, [smartAccountAddress, token])

  useEffect(() => {
    if (!token || !smartAccountAddress) return

    getBalance()
  }, [smartAccountAddress, getBalance, token])

  return { balance, refetch: getBalance }
}

export default useTokenBalance
