import { useCallback } from 'react'
import { ethers } from 'ethers'
import { coinTokenAddress } from 'contracts/address'
import AirlineCoin from 'contracts/abi/AirlineCoin.json'
import { Hex, UserOperationCallData } from '@alchemy/aa-core'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'

const useAlchemyWallet = () => {
  const wallet = useRecoilValue(walletStore)

  const sendTransaction = useCallback(
    async (target: Hex, value: string) => {
      if (!wallet.smartAccountAddress || !wallet.paymasterSigner || !wallet.smartSigner) return

      const amount = ethers.utils.parseEther(value)
      const erc20Contract = new ethers.Contract(coinTokenAddress, AirlineCoin.abi)

      // Encode the transfer function call
      const encodedApproveCallData = erc20Contract.interface.encodeFunctionData('approve', [
        wallet.smartAccountAddress,
        amount
      ]) as Hex

      const uoStruct: UserOperationCallData = {
        target,
        data: encodedApproveCallData
      }

      const uoSimResult = await wallet.smartSigner.simulateUserOperation({
        uo: uoStruct
      })

      if (uoSimResult.error) {
        console.error('Simulation error =>', uoSimResult.error.message)
      }

      const { hash: tx1 } = await wallet.paymasterSigner.sendUserOperation({
        uo: {
          target: coinTokenAddress,
          data: encodedApproveCallData
        }
      })

      await wallet.paymasterSigner.waitForUserOperationTransaction(tx1)

      const encodedCallData = erc20Contract.interface.encodeFunctionData('transferFrom', [
        wallet.smartAccountAddress,
        target,
        amount
      ]) as Hex
      const { hash } = await wallet.paymasterSigner.sendUserOperation({
        target: coinTokenAddress,
        data: encodedCallData
      })

      await wallet.paymasterSigner.waitForUserOperationTransaction(hash)

      return hash
    },
    [wallet.smartAccountAddress, wallet.paymasterSigner, wallet.smartSigner]
  )

  return { sendTransaction }
}

export default useAlchemyWallet
