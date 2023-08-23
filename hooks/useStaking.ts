import { Hex } from '@alchemy/aa-core'
import { SmartContract } from '@thirdweb-dev/sdk'
import axios from 'config/axios'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { stakingAddress } from 'contracts/address'
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
        const erc20Staking = new ethers.Contract(stakingAddress, contract.abi)
        const encodedCallData = erc20Staking.interface.encodeFunctionData('stake', [amount])

        const { hash } = await paymasterSigner.sendUserOperation({
          target: stakingAddress,
          data: encodedCallData as Hex
        })

        await axios.post('/api/transaction/user', {
          operation: 'claimRewards',
          amount: amount.toString(),
          hash
        })
        await paymasterSigner.waitForUserOperationTransaction(hash as Hex)

        setIsLoading(false)
        return hash
      } catch (error) {}
    },
    [contract, paymasterSigner]
  )

  const withdraw = useCallback(
    async (amount: BigNumber) => {
      if (!contract || !paymasterSigner) return
      setIsLoading(true)

      const erc20Staking = new ethers.Contract(stakingAddress, contract.abi)
      const encodedCallData = erc20Staking.interface.encodeFunctionData('withdraw', [amount])

      const { hash } = await paymasterSigner.sendUserOperation({
        target: stakingAddress,
        data: encodedCallData as Hex
      })

      await paymasterSigner.waitForUserOperationTransaction(hash as Hex)

      setIsLoading(false)
      return hash
    },
    [contract, paymasterSigner]
  )

  const claimRewards = useCallback(async () => {
    if (!contract || !paymasterSigner) return
    setIsLoading(true)

    const erc20Staking = new ethers.Contract(stakingAddress, contract.abi)
    const encodedCallData = erc20Staking.interface.encodeFunctionData('claimRewards', [])

    const { hash } = await paymasterSigner.sendUserOperation({
      target: stakingAddress,
      data: encodedCallData as Hex
    })

    await paymasterSigner.waitForUserOperationTransaction(hash as Hex)

    setIsLoading(false)
    return hash
  }, [contract, paymasterSigner])

  return { stake, withdraw, claimRewards, isLoading }
}

export default useStaking
