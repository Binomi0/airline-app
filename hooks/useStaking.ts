import { Hex } from '@alchemy/aa-core'
import { SmartContract } from '@thirdweb-dev/sdk'
import axios from 'config/axios'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { stakingAddress as target } from 'contracts/address'
import { BigNumber, ethers } from 'ethers'
import { useCallback, useState } from 'react'

const useStaking = (contract?: SmartContract<ethers.BaseContract> | undefined) => {
  const [isLoading, setIsLoading] = useState(false)
  const { smartSigner } = useAlchemyProviderContext()

  const stake = useCallback(
    async (amount: BigNumber) => {
      if (!contract || !smartSigner) return
      setIsLoading(true)

      try {
        const erc20Staking = new ethers.Contract(target, contract.abi)
        const data = erc20Staking.interface.encodeFunctionData('stake', [amount]) as Hex

        const { hash } = await smartSigner.sendUserOperation({ uo: { target, data } })

        await axios.post('/api/transaction/user', { operation: 'stake', amount, hash })
        await smartSigner.waitForUserOperationTransaction(hash as Hex)

        setIsLoading(false)
        return await smartSigner.getUserOperationReceipt(hash as Hex)
      } catch (error) {}
    },
    [contract, smartSigner]
  )

  const withdraw = useCallback(
    async (amount: BigNumber) => {
      if (!contract || !smartSigner) return
      setIsLoading(true)

      const erc20Staking = new ethers.Contract(target, contract.abi)
      const data = erc20Staking.interface.encodeFunctionData('withdraw', [amount]) as Hex

      const { hash } = await smartSigner.sendUserOperation({ target, data })

      await axios.post('/api/transaction/user', { operation: 'claimRewards', amount, hash })
      await smartSigner.waitForUserOperationTransaction(hash as Hex)

      setIsLoading(false)
      return await smartSigner.getUserOperationReceipt(hash as Hex)
    },
    [contract, smartSigner]
  )

  const claimRewards = useCallback(
    async (amount: string) => {
      if (!contract || !smartSigner) return
      setIsLoading(true)

      const erc20Staking = new ethers.Contract(target, contract.abi)
      const data = erc20Staking.interface.encodeFunctionData('claimRewards', []) as Hex
      const { hash } = await smartSigner.sendUserOperation({ target, data })

      await axios.post('/api/transaction/user', { operation: 'claimRewards', amount, hash })
      await smartSigner.waitForUserOperationTransaction(hash as Hex)

      setIsLoading(false)
      return await smartSigner.getUserOperationReceipt(hash as Hex)
    },
    [contract, smartSigner]
  )

  return { stake, withdraw, claimRewards, isLoading }
}

export default useStaking
