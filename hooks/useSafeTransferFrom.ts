import { nftLicenseTokenAddress } from 'contracts/address'
import { useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { userState } from 'store/user.atom'
import { prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb'
import useWallet from './useWallet'

const useSafeTransferFrom = () => {
  const [loading, setLoading] = useState(false)
  const { smartSigner, twClient, twChain, isLocked } = useRecoilValue(walletStore)
  const user = useRecoilValue(userState)
  const { unlockSigner } = useWallet()

  const safeTransferFrom = useCallback(async () => {
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
    setLoading(true)

    try {
      const tx = prepareContractCall({
        contract: {
          client: twClient,
          chain: twChain,
          address: nftLicenseTokenAddress
        },
        method: 'function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)',
        params: [
          '0xA832BC0b75161E5f69cBd66970b8df7eCE846e47', // FROM (Hardcoded in original)
          '0x98CDf5F4D4D7f5b97F84c82fC44F591a239290e4', // TO (Hardcoded in original)
          0n, // TOKEN ID
          1n, // QUANTITY
          '0x' // DATA
        ]
      })

      const result = await sendTransaction({
        transaction: tx,
        account: currentSigner
      })

      const receipt = await waitForReceipt(result)
      console.log('Transfer successful:', receipt.transactionHash)
    } catch (error) {
      console.error('Error in safeTransferFrom:', error)
    } finally {
      setLoading(false)
    }
  }, [smartSigner, twChain, twClient, isLocked, unlockSigner, user])

  return {
    safeTransferFrom,
    loading
  }
}

export default useSafeTransferFrom
