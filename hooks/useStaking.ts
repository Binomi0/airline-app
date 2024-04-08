import { SmartContract } from '@thirdweb-dev/sdk'
import { stakingAddress as target } from 'contracts/address'
import { BigNumber, ethers } from 'ethers'
import { postApi } from 'lib/api'
import { useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { paymasterSignerStore, smartAccountSignerStore } from 'store/wallet.atom'

const useStaking = (contract?: SmartContract<ethers.BaseContract> | undefined) => {
  const [isLoading, setIsLoading] = useState(false)
  const smartSigner = useRecoilValue(smartAccountSignerStore)
  const paymasterSigner = useRecoilValue(paymasterSignerStore)

  const stake = useCallback(
    async (amount: BigNumber) => {
      if (!contract || !paymasterSigner) return
      setIsLoading(true)

      try {
        const erc20Staking = new ethers.Contract(target, contract.abi)
        const data = erc20Staking.interface.encodeFunctionData('stake', [amount])
        const uo = await paymasterSigner.sendUserOperation({ uo: { target, data } })

        const hash = await paymasterSigner.waitForUserOperationTransaction(uo)
        await postApi('/api/transaction/user', { operation: 'stake', amount, hash })

        const receipt = await paymasterSigner.getUserOperationReceipt(hash)
        setIsLoading(false)

        return receipt
      } catch (error) {
        setIsLoading(false)
      }
    },
    [contract, paymasterSigner]
  )

  const withdraw = useCallback(
    async (amount: BigNumber) => {
      if (!contract || !paymasterSigner) return
      setIsLoading(true)

      try {
        const erc20Staking = new ethers.Contract(target, contract.abi)
        const data = erc20Staking.interface.encodeFunctionData('withdraw', [amount])
        const uo = await paymasterSigner.sendUserOperation({ uo: { target, data } })

        const hash = await paymasterSigner.waitForUserOperationTransaction(uo)
        await postApi('/api/transaction/user', { operation: 'withdraw', amount, hash })

        const receipt = await paymasterSigner.getUserOperationReceipt(hash)
        setIsLoading(false)

        return receipt
      } catch (err) {
        setIsLoading(false)
      }
    },
    [contract, paymasterSigner]
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
        await postApi('/api/transaction/user', { operation: 'claimRewards', amount, hash })

        const receipt = await smartSigner.getUserOperationReceipt(hash)
        setIsLoading(false)

        return receipt
      } catch (err) {
        // @ts-expect-error
        if (err?.message === `AA21 didn't pay prefund`) {
          console.log('Paga cabrón xD')
        } else {
          console.error(err)
        }
        setIsLoading(false)
      }
    },
    [contract, smartSigner]
  )

  return { stake, withdraw, claimRewards, isLoading }
}

export default useStaking
