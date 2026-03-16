import { useCallback, useState } from 'react'

import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore, walletStore } from 'store/wallet.atom'
import { Hex, readContract } from 'thirdweb'

const useTokenBalance = (contractAddress?: Hex) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const { twClient, twChain } = useRecoilValue(walletStore)
  const [balance, setBalance] = useState<bigint | undefined>()
  const [isFetched, setIsFetched] = useState<boolean>(false)

  const getBalance = useCallback(async () => {
    if (!contractAddress || !smartAccountAddress || !twClient || !twChain) return 0n

    try {
      const data = await readContract({
        contract: {
          client: twClient,
          chain: twChain,
          address: contractAddress
        },
        method: 'function balanceOf(address) view returns (uint256)',
        params: [smartAccountAddress]
      })

      const result = BigInt(data as any)
      setBalance(result)
      setIsFetched(true)
      return result
    } catch (error) {
      console.error('Error fetching balance:', error)
      return 0n
    }
  }, [contractAddress, smartAccountAddress, twChain, twClient])

  return { balance, refetch: getBalance, getBalance, isFetched }
}

export default useTokenBalance
