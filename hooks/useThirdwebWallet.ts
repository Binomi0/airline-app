import { useCallback } from 'react'
import { coinTokenAddress } from 'contracts/address'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { userState } from 'store/user.atom'
import { prepareContractCall, sendTransaction, waitForReceipt, readContract } from 'thirdweb'
import useWallet from './useWallet'
import { ethers } from 'ethers'

const useThirdwebWallet = () => {
  const { smartSigner, twClient, twChain, isLocked } = useRecoilValue(walletStore)
  const user = useRecoilValue(userState)
  const { unlockSigner } = useWallet()

  const sendTWTransaction = useCallback(
    async (target: string, value: string) => {
      let currentSigner = smartSigner

      if (isLocked && user) {
        try {
          currentSigner = await unlockSigner(user)
        } catch (e) {
          console.error('Failed to unlock signer:', e)
          throw new Error('Wallet must be unlocked to perform transactions')
        }
      }

      if (!currentSigner || !twClient || !twChain) {
        console.error('Wallet not fully loaded', {
          smartSigner: !!smartSigner,
          twClient: !!twClient,
          twChain: !!twChain
        })
        return
      }

      try {
        const amount = ethers.utils.parseEther(value).toBigInt()

        // 1. Check current allowance
        const currentAllowance = await readContract({
          contract: {
            client: twClient,
            chain: twChain,
            address: coinTokenAddress
          },
          method: 'function allowance(address owner, address spender) view returns (uint256)',
          params: [currentSigner.address, currentSigner.address]
        })

        if (currentAllowance < amount) {
          console.log('Allowance insufficient, approving...')
          const maxUint256 = BigInt('0x' + 'f'.repeat(64))

          const approveTx = prepareContractCall({
            contract: {
              client: twClient,
              chain: twChain,
              address: coinTokenAddress
            },
            method: 'function approve(address spender, uint256 amount)',
            params: [currentSigner.address, maxUint256]
          })

          const approveResult = await sendTransaction({
            transaction: approveTx,
            account: currentSigner
          })

          await waitForReceipt(approveResult)
        } else {
          console.log('Allowance sufficient, skipping approval.')
        }

        // 2. Prepare TransferFrom Transaction
        const transferFromTx = prepareContractCall({
          contract: {
            client: twClient,
            chain: twChain,
            address: coinTokenAddress
          },
          method: 'function transferFrom(address from, address to, uint256 amount)',
          params: [currentSigner.address, target, amount]
        })

        const transferResult = await sendTransaction({
          transaction: transferFromTx,
          account: currentSigner
        })

        const receipt = await waitForReceipt(transferResult)
        return receipt.transactionHash
      } catch (error) {
        console.error('Error sending Thirdweb transaction:', error)
        throw error
      }
    },
    [smartSigner, twClient, twChain, isLocked, unlockSigner, user]
  )

  return { sendTransaction: sendTWTransaction }
}

export default useThirdwebWallet
