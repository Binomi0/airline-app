import { Hex } from '@alchemy/aa-core'
import { useContract } from '@thirdweb-dev/react'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { coinTokenAddress, stakingAddress } from 'contracts/address'
import { BigNumber, Contract } from 'ethers'
import { useCallback, useState } from 'react'
import AirlineCoin from 'contracts/abi/AirlineCoin.json'

const useERC20 = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { paymasterSigner } = useAlchemyProviderContext()
  const { contract } = useContract(stakingAddress)

  const setAllowance = useCallback(
    async (to: string, amount: BigNumber) => {
      if (!paymasterSigner || !contract) return false
      setIsLoading(true)

      const erc20Staking = new Contract(coinTokenAddress, AirlineCoin.abi)
      const encodedCallData = erc20Staking.interface.encodeFunctionData('approve', [to, amount])

      const { hash } = await paymasterSigner.sendUserOperation({
        target: coinTokenAddress,
        data: encodedCallData as Hex
      })

      await paymasterSigner.waitForUserOperationTransaction(hash as Hex)
      setIsLoading(false)
      return true
    },
    [contract, paymasterSigner]
  )
  return { setAllowance, isLoading }
}

export default useERC20
