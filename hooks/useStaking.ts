import { Hex } from '@alchemy/aa-core'
import { SmartContract } from '@thirdweb-dev/sdk'
import axios from 'config/axios'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { stakingAddress as target } from 'contracts/address'
import { BigNumber, ethers } from 'ethers'
import { useCallback, useState } from 'react'

const useStaking = (contract?: SmartContract<ethers.BaseContract> | undefined) => {
  const [isLoading, setIsLoading] = useState(false)
  const { paymasterSigner } = useAlchemyProviderContext()

  const stake = useCallback(
    async (amount: BigNumber) => {
      if (!contract || !paymasterSigner) return
      setIsLoading(true)

      try {
        const erc20Staking = new ethers.Contract(target, contract.abi)
        const data = erc20Staking.interface.encodeFunctionData('stake', [amount]) as Hex

        const { hash } = await paymasterSigner.sendUserOperation({ target, data })

        await axios.post('/api/transaction/user', { operation: 'stake', amount: amount.toString(), hash })
        await paymasterSigner.waitForUserOperationTransaction(hash as Hex)

        setIsLoading(false)
        return await paymasterSigner.getUserOperationReceipt(hash as Hex)
      } catch (error) {}
    },
    [contract, paymasterSigner]
  )

  const withdraw = useCallback(
    async (amount: BigNumber) => {
      if (!contract || !paymasterSigner) return
      setIsLoading(true)

      const erc20Staking = new ethers.Contract(target, contract.abi)
      const data = erc20Staking.interface.encodeFunctionData('withdraw', [amount]) as Hex

      const { hash } = await paymasterSigner.sendUserOperation({ target, data })

      await axios.post('/api/transaction/user', { operation: 'claimRewards', amount: amount.toString(), hash })
      await paymasterSigner.waitForUserOperationTransaction(hash as Hex)

      setIsLoading(false)
      return await paymasterSigner.getUserOperationReceipt(hash as Hex)
    },
    [contract, paymasterSigner]
  )

  const claimRewards = useCallback(
    async (amount: string) => {
      if (!contract || !paymasterSigner) return
      setIsLoading(true)

      const erc20Staking = new ethers.Contract(target, contract.abi)
      const data = erc20Staking.interface.encodeFunctionData('claimRewards', []) as Hex
      const { hash } = await paymasterSigner.sendUserOperation({ target, data })

      await axios.post('/api/transaction/user', { operation: 'claimRewards', amount, hash })
      await paymasterSigner.waitForUserOperationTransaction(hash as Hex)

      setIsLoading(false)
      return await paymasterSigner.getUserOperationReceipt(hash as Hex)
    },
    [contract, paymasterSigner]
  )

  return { stake, withdraw, claimRewards, isLoading }
}

export default useStaking
