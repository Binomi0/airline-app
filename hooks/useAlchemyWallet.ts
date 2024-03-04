import { useCallback } from 'react'
import { useAlchemyProviderContext } from 'context/AlchemyProvider/AlchemyProvider.context'
import { ethers } from 'ethers'
import { coinTokenAddress } from 'contracts/address'
import AirlineCoin from 'contracts/abi/AirlineCoin.json'
import { Hex } from '@alchemy/aa-core'

const useAlchemyWallet = () => {
  const { smartSigner, paymasterSigner, smartAccountAddress } = useAlchemyProviderContext()

  const sendTransaction = useCallback(
    async (target: string, value: string) => {
      if (!paymasterSigner || !smartAccountAddress || !smartSigner?.account) return

      const amount = ethers.utils.parseEther(value)
      const erc20Contract = new ethers.Contract(coinTokenAddress, AirlineCoin.abi)

      // Encode the transfer function call
      const encodedApproveCallData = erc20Contract.interface.encodeFunctionData('approve', [
        smartAccountAddress,
        amount
      ]) as Hex
      const { hash: tx1 } = await paymasterSigner.sendUserOperation({
        target: coinTokenAddress,
        data: encodedApproveCallData
      })

      await smartSigner.waitForUserOperationTransaction(tx1)

      const encodedCallData = erc20Contract.interface.encodeFunctionData('transferFrom', [
        smartAccountAddress,
        target,
        amount
      ]) as Hex
      const { hash } = await paymasterSigner.sendUserOperation({
        target: coinTokenAddress,
        data: encodedCallData
      })

      await smartSigner.waitForUserOperationTransaction(hash)

      return hash
    },
    [paymasterSigner, smartAccountAddress, smartSigner]
  )

  return { sendTransaction }
}

export default useAlchemyWallet
