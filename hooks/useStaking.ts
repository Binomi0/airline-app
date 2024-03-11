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
        const data = erc20Staking.interface.encodeFunctionData('stake', [amount])
        const uo = await smartSigner.sendUserOperation({ uo: { target, data } })

        const hash = await smartSigner.waitForUserOperationTransaction(uo)
        await axios.post('/api/transaction/user', { operation: 'stake', amount, hash })

        const receipt = await smartSigner.getUserOperationReceipt(hash)
        setIsLoading(false)

        return receipt
      } catch (error) {
        setIsLoading(false)
      }
    },
    [contract, smartSigner]
  )

  const withdraw = useCallback(
    async (amount: BigNumber) => {
      if (!contract || !smartSigner) return
      setIsLoading(true)

      try {
        const erc20Staking = new ethers.Contract(target, contract.abi)
        const data = erc20Staking.interface.encodeFunctionData('withdraw', [amount])
        const uo = await smartSigner.sendUserOperation({ uo: { target, data } })

        const hash = await smartSigner.waitForUserOperationTransaction(uo)
        await axios.post('/api/transaction/user', { operation: 'withdraw', amount, hash })

        const receipt = await smartSigner.getUserOperationReceipt(hash)
        setIsLoading(false)

        return receipt
      } catch (err) {
        setIsLoading(false)
      }
    },
    [contract, smartSigner]
  )

  const claimRewards = useCallback(
    async (amount: string) => {
      if (!contract || !smartSigner) return
      setIsLoading(true)

      try {
        const erc20Staking = new ethers.Contract(target, contract.abi)
        const data = erc20Staking.interface.encodeFunctionData('claimRewards', [])
        const hash = await smartSigner.sendUserOperation({ uo: { target, data } })

        await smartSigner.waitForUserOperationTransaction(hash)
        await axios.post('/api/transaction/user', { operation: 'claimRewards', amount, hash })

        const receipt = await smartSigner.getUserOperationReceipt(hash)
        setIsLoading(false)

        return receipt
      } catch (err) {
        console.error(err)
        setIsLoading(false)
      }
    },
    [contract, smartSigner]
  )

  return { stake, withdraw, claimRewards, isLoading }
}

export default useStaking
