import { SimpleSmartContractAccount, SmartAccountProvider, type SimpleSmartAccountOwner, Hex } from '@alchemy/aa-core'
import { sepolia } from '@wagmi/chains'
import { useCallback, useEffect } from 'react'
import { withAlchemyGasManager } from '@alchemy/aa-alchemy'
import { useAlchemyProviderContext } from 'context/AlchemyProvider/AlchemyProvider.context'
import { Wallet, ethers } from 'ethers'
import { coinTokenAddress } from 'contracts/address'
import AirlineCoin from 'contracts/abi/AirlineCoin.json'

const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454'
const ENTRY_POINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

const useAlchemyWallet = (signer?: Wallet) => {
  const {
    smartSigner,
    paymasterSigner,
    smartAccountAddress,
    setSmartAccountAddress,
    setBaseSigner,
    setSmartSigner,
    setPaymasterSigner
  } = useAlchemyProviderContext()

  const sendTransaction = useCallback(
    async (target: string, value: string) => {
      if (!paymasterSigner || !smartAccountAddress || !smartSigner?.account || !signer) return

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

      await smartSigner.waitForUserOperationTransaction(tx1 as Hex)

      const encodedCallData = erc20Contract.interface.encodeFunctionData('transferFrom', [
        smartAccountAddress,
        target,
        amount
      ]) as Hex
      const { hash } = await paymasterSigner.sendUserOperation({
        target: coinTokenAddress,
        data: encodedCallData
      })

      await smartSigner.waitForUserOperationTransaction(hash as Hex)

      return hash
    },
    [paymasterSigner, signer, smartAccountAddress, smartSigner]
  )

  const initialize = useCallback(async () => {
    if (!signer) return

    const owner: SimpleSmartAccountOwner = {
      // @ts-ignore
      signMessage: async (msg) => signer.signMessage(msg),
      getAddress: async () => signer.address as Hex,
      // @ts-ignore
      signTypedData: signer.signTypedData
    }

    const smartSigner = new SmartAccountProvider(
      // the demo key below is public and rate-limited, it's better to create a new one
      // you can get started with a free account @ https://www.alchemy.com/
      process.env.NEXT_PUBLIC_ALCHEMY_URL_ETH_SEPOLIA || '', // rpcUrl
      ENTRY_POINT, // entryPointAddress
      sepolia // chain
    ).connect(
      (rpcClient) =>
        new SimpleSmartContractAccount({
          entryPointAddress: ENTRY_POINT,
          chain: sepolia,
          factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
          rpcClient,
          owner,
          // optionally if you already know the account's address
          accountAddress: smartAccountAddress
        })
    )

    const newPaymasterSigner = withAlchemyGasManager(smartSigner, {
      // provider: smartSigner.rpcClient,
      policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID_ETH_SEPOLIA || '',
      entryPoint: ENTRY_POINT
    })

    if (!smartAccountAddress) {
      const address = await smartSigner.account.getAddress()
      setSmartAccountAddress(address)
    }

    setBaseSigner(signer)
    setSmartSigner(smartSigner)
    setPaymasterSigner(newPaymasterSigner)
  }, [setBaseSigner, setPaymasterSigner, setSmartAccountAddress, setSmartSigner, signer, smartAccountAddress])

  useEffect(() => {
    if (!signer) return
    initialize()
  }, [signer, initialize])

  return { sendTransaction }
}

export default useAlchemyWallet
