import { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { Hex, prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb'
import axios from 'config/axios'

const MAX_UINT256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

interface UseERC20ReturnType {
  // eslint-disable-next-line no-unused-vars
  getAllowance: (spender: string) => Promise<BigNumber>
  // eslint-disable-next-line no-unused-vars
  setAllowance: (to: string) => Promise<boolean>
  isLoading: boolean
}

const useERC20 = (tokenAddress: Hex): UseERC20ReturnType => {
  const [isLoading, setIsLoading] = useState(false)
  const { smartSigner, twClient, twChain, smartAccountAddress } = useRecoilValue(walletStore)

  const getAllowance = useCallback(
    async (spender: string): Promise<BigNumber> => {
      if (!smartAccountAddress || !twClient || !twChain) return new BigNumber(0)
      setIsLoading(true)

      try {
        const { data: allowance } = await axios.post('/api/contracts/read', {
          address: tokenAddress,
          method: "function allowance(address owner, address spender) view returns (uint256)",
          params: [smartAccountAddress, spender]
        })

        setIsLoading(false)
        return new BigNumber(allowance.toString()).div(1e18) // Adjusting based on displayValue behavior
      } catch (error) {
        console.error('getAllowance', error)
        setIsLoading(false)
        return new BigNumber(0)
      }
    },
    [smartAccountAddress, twChain, twClient, tokenAddress]
  )

  const setAllowance = useCallback(
    async (to: string) => {
      if (!smartSigner || !twClient || !twChain) return false
      try {
        setIsLoading(true)

        const tx = prepareContractCall({
          contract: {
            client: twClient,
            chain: twChain,
            address: tokenAddress!
          },
          method: "function approve(address spender, uint256 amount)",
          params: [to, MAX_UINT256]
        })

        const result = await sendTransaction({
          transaction: tx,
          account: smartSigner
        })

        const receipt = await waitForReceipt(result)
        console.log({ txHash: receipt.transactionHash })
        setIsLoading(false)
        return true
      } catch (error) {
        console.error('[setAllowance]', error)
        setIsLoading(false)
        throw new Error('Error while setAllowance')
      }
    },
    [smartSigner, twClient, twChain, tokenAddress]
  )
  return { setAllowance, getAllowance, isLoading }
}

export default useERC20
