import { stakingAddress as target } from 'contracts/address'
import { BigNumber } from 'ethers'
import { postApi } from 'lib/api'
import { useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { userState } from 'store/user.atom'
import { prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb'
import useWallet from './useWallet'

const useStaking = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { smartSigner, twClient, twChain, isLocked } = useRecoilValue(walletStore)
  const user = useRecoilValue(userState)
  const { unlockSigner } = useWallet()

  const stake = useCallback(
    async (amount: BigNumber) => {
      let currentSigner = smartSigner

      if (isLocked && user) {
        try {
          currentSigner = await unlockSigner(user)
        } catch (e) {
          console.error('Failed to unlock signer:', e)
          throw new Error('Wallet must be unlocked to perform transactions')
        }
      }

      if (!currentSigner || !twClient || !twChain) return
      setIsLoading(true)

      try {
        const tx = prepareContractCall({
          contract: {
            client: twClient,
            chain: twChain,
            address: target
          },
          method: 'function stake(uint256 amount)',
          params: [amount.toBigInt()]
        })

        const result = await sendTransaction({
          transaction: tx,
          account: currentSigner
        })

        const receipt = await waitForReceipt(result)
        const hash = receipt.transactionHash

        await postApi('/api/transaction/user', { operation: 'stake', amount, hash })
        setIsLoading(false)

        return receipt
      } catch (error) {
        console.error('Error in stake:', error)
        setIsLoading(false)
      }
    },
    [smartSigner, twChain, twClient, isLocked, unlockSigner, user]
  )

  const withdraw = useCallback(
    async (amount: BigNumber) => {
      let currentSigner = smartSigner

      if (isLocked && user) {
        try {
          currentSigner = await unlockSigner(user)
        } catch (e) {
          console.error('Failed to unlock signer:', e)
          throw new Error('Wallet must be unlocked to perform transactions')
        }
      }

      if (!currentSigner || !twClient || !twChain) return
      setIsLoading(true)

      try {
        const tx = prepareContractCall({
          contract: {
            client: twClient,
            chain: twChain,
            address: target
          },
          method: 'function withdraw(uint256 amount)',
          params: [amount.toBigInt()]
        })

        const result = await sendTransaction({
          transaction: tx,
          account: currentSigner
        })

        const receipt = await waitForReceipt(result)
        const hash = receipt.transactionHash

        await postApi('/api/transaction/user', { operation: 'withdraw', amount, hash })
        setIsLoading(false)

        return receipt
      } catch (err) {
        console.error('Error in withdraw:', err)
        setIsLoading(false)
      }
    },
    [smartSigner, twChain, twClient, isLocked, unlockSigner, user]
  )

  const claimRewards = useCallback(
    async (amount: string) => {
      let currentSigner = smartSigner

      if (isLocked && user) {
        try {
          currentSigner = await unlockSigner(user)
        } catch (e) {
          console.error('Failed to unlock signer:', e)
          throw new Error('Wallet must be unlocked to perform transactions')
        }
      }

      if (!currentSigner || !twClient || !twChain) return
      setIsLoading(true)

      try {
        const tx = prepareContractCall({
          contract: {
            client: twClient,
            chain: twChain,
            address: target
          },
          method: 'function claimRewards()',
          params: []
        })

        const result = await sendTransaction({
          transaction: tx,
          account: currentSigner
        })

        const receipt = await waitForReceipt(result)
        const hash = receipt.transactionHash

        await postApi('/api/transaction/user', { operation: 'claimRewards', amount, hash })
        setIsLoading(false)

        return receipt
      } catch (err) {
        // @ts-expect-error - Keeping original error logic partially
        if (err?.message === `AA21 didn't pay prefund`) {
          console.log('Paga cabrón xD')
        } else {
          console.error(err)
        }
        setIsLoading(false)
      }
    },
    [smartSigner, twChain, twClient, isLocked, unlockSigner, user]
  )

  return { stake, withdraw, claimRewards, isLoading }
}

export default useStaking
