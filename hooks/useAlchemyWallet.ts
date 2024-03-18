import { useCallback } from 'react'
import { ethers } from 'ethers'
import { coinTokenAddress } from 'contracts/address'
import AirlineCoin from 'contracts/abi/AirlineCoin.json'
import { Hex } from '@alchemy/aa-core'
import { useRecoilState } from 'recoil'
import { walletStore } from 'store/wallet.atom'

const useAlchemyWallet = () => {
  const [wallet] = useRecoilState(walletStore)

  const sendTransaction = useCallback(
    async (target: string, value: string) => {
      if (!wallet.smartAccountAddress || !wallet.smartSigner) return

      const amount = ethers.utils.parseEther(value)
      const erc20Contract = new ethers.Contract(coinTokenAddress, AirlineCoin.abi)

      // Encode the transfer function call
      const encodedApproveCallData = erc20Contract.interface.encodeFunctionData('approve', [
        wallet.smartAccountAddress,
        amount
      ]) as Hex
      const { hash: tx1 } = await wallet.smartSigner.sendUserOperation({
        uo: {
          target: coinTokenAddress,
          data: encodedApproveCallData
        }
      })

      await wallet.smartSigner.waitForUserOperationTransaction(tx1)

      const encodedCallData = erc20Contract.interface.encodeFunctionData('transferFrom', [
        wallet.smartAccountAddress,
        target,
        amount
      ]) as Hex
      const { hash } = await wallet.smartSigner.sendUserOperation({
        target: coinTokenAddress,
        data: encodedCallData
      })

      await wallet.smartSigner.waitForUserOperationTransaction(hash)

      return hash
    },
    [wallet.smartAccountAddress, wallet.smartSigner]
  )

  return { sendTransaction }
}

export default useAlchemyWallet
