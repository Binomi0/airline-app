import { Hex } from '@alchemy/aa-core'
import { useContract } from '@thirdweb-dev/react'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { Contract } from 'ethers'
import { useCallback, useState } from 'react'
import AirlineCoin from 'contracts/abi/AirlineCoin.json'
import BigNumber from 'bignumber.js'

const MAX_INT_ETH = '0x8000000000000000000000000000000000000000000000000000000000000000'

interface UseERC20ReturnType {
  // eslint-disable-next-line no-unused-vars
  getAllowance: (spender: Hex) => Promise<BigNumber>
  // eslint-disable-next-line no-unused-vars
  setAllowance: (to: Hex) => Promise<boolean>
  isLoading: boolean
}

const useERC20 = (tokenAddress: Hex): UseERC20ReturnType => {
  const [isLoading, setIsLoading] = useState(false)
  const { contract } = useContract(tokenAddress, 'token')
  const { paymasterSigner, smartAccountAddress } = useAlchemyProviderContext()

  const getAllowance = useCallback(
    async (spender: string): Promise<BigNumber> => {
      if (!paymasterSigner || !smartAccountAddress || !contract) return new BigNumber(0)
      setIsLoading(true)

      try {
        const allowance = await contract.erc20.allowanceOf(smartAccountAddress, spender)

        setIsLoading(false)
        return new BigNumber(allowance.displayValue)
      } catch (error) {
        console.error('getAllowance', error)
        setIsLoading(false)
        return new BigNumber(0)
      }
    },
    [contract, paymasterSigner, smartAccountAddress]
  )

  const setAllowance = useCallback(
    async (to: string) => {
      if (!paymasterSigner) return false

      try {
        setIsLoading(true)

        const erc20Staking = new Contract(tokenAddress, AirlineCoin.abi)
        const encodedCallData = erc20Staking.interface.encodeFunctionData('approve', [to, MAX_INT_ETH])

        const { hash } = await paymasterSigner.sendUserOperation({ target: tokenAddress, data: encodedCallData as Hex })
        await paymasterSigner.waitForUserOperationTransaction(hash as Hex)
        setIsLoading(false)
        return true
      } catch (error) {
        console.error('[setAllowance]', error)
        setIsLoading(false)
        return false
      }
    },
    [paymasterSigner, tokenAddress]
  )
  return { setAllowance, getAllowance, isLoading }
}

export default useERC20
