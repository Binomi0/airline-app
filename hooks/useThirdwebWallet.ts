import { useCallback } from 'react'
import { coinTokenAddress } from 'contracts/address'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { prepareContractCall, sendTransaction, waitForReceipt, readContract } from 'thirdweb'
import { ethers } from 'ethers'

const useThirdwebWallet = () => {
  const { smartSigner, twClient, twChain } = useRecoilValue(walletStore)

  const sendTWTransaction = useCallback(
    async (target: string, value: string) => {
      if (!smartSigner || !twClient || !twChain) {
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
          params: [smartSigner.address, smartSigner.address] // Spender is also the smart wallet in this context of transferFrom?
          // Wait, in useAlchemyWallet it was approving balance to itself?
          // Let's re-verify the original logic.
        })

        // Verification of original logic:
        // wallet.smartSigner.sendUserOperation({ uo: { target: coinTokenAddress, data: encodedApproveCallData } })
        // encodedApproveCallData = approve(wallet.smartAccountAddress, amount)
        // This means the smart wallet approves ITSELF to spend its tokens.
        // This is usually done for certain account abstractions or relayers.

        if (currentAllowance < amount) {
          console.log('Allowance insufficient, approving...')
          // Use a very large number for approval to avoid future approvals
          const maxUint256 = BigInt('0x' + 'f'.repeat(64))

          const approveTx = prepareContractCall({
            contract: {
              client: twClient,
              chain: twChain,
              address: coinTokenAddress
            },
            method: 'function approve(address spender, uint256 amount)',
            params: [smartSigner.address, maxUint256]
          })

          const approveResult = await sendTransaction({
            transaction: approveTx,
            account: smartSigner
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
          params: [smartSigner.address, target, amount]
        })

        const transferResult = await sendTransaction({
          transaction: transferFromTx,
          account: smartSigner
        })

        const receipt = await waitForReceipt(transferResult)
        return receipt.transactionHash
      } catch (error) {
        console.error('Error sending Thirdweb transaction:', error)
        throw error
      }
    },
    [smartSigner, twClient, twChain]
  )

  return { sendTransaction: sendTWTransaction }
}

export default useThirdwebWallet
