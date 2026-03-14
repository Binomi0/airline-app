import { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore, walletStore } from 'store/wallet.atom'
import { Hex, readContract } from 'thirdweb'

const useTokenBalance = (contractAddress?: Hex) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const { twClient, twChain } = useRecoilValue(walletStore)
  const [balance, setBalance] = useState<BigNumber | undefined>()
  const [isFetched, setIsFetched] = useState<boolean>(false)

  const getBalance = useCallback(async () => {
    if (!contractAddress || !smartAccountAddress || !twClient || !twChain) return new BigNumber(0)

    try {
      const data = await readContract({
        contract: {
          client: twClient,
          chain: twChain,
          address: contractAddress
        },
        method: "function balanceOf(address) view returns (uint256)",
        params: [smartAccountAddress]
      })

      const result = new BigNumber(data.toString()).div(1e18)
      setBalance(result)
      setIsFetched(true)
      return result
    } catch (error) {
      console.error('Error fetching balance:', error)
      return new BigNumber(0)
    }
  }, [contractAddress, smartAccountAddress, twChain, twClient])

  return { balance, refetch: getBalance, getBalance, isFetched }
}

export default useTokenBalance
