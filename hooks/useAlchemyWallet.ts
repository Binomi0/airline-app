import { SimpleSmartContractAccount, SmartAccountProvider, type SimpleSmartAccountOwner, Hex } from '@alchemy/aa-core'
import { sepolia } from 'viem/chains'
import { toHex } from 'viem'
import { useCallback, useEffect } from 'react'
import { withAlchemyGasManager } from '@alchemy/aa-alchemy'
import { useAlchemyProviderContext } from 'context/AlchemyProvider/AlchemyProvider.context'
import { Wallet, ethers } from 'ethers'
import { Network, Alchemy } from 'alchemy-sdk'
import { coinTokenAddress } from 'contracts/address'
import AirlineCoin from 'contracts/abi/AirlineCoin.json'
import { useContract } from '@thirdweb-dev/react'
import BigNumber from 'bignumber.js'

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_SEPOLIA, // Replace with your Alchemy API Key.
  network: Network.ETH_SEPOLIA // Replace with your network.
}

const alchemy = new Alchemy(settings)

const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454'
const ENTRY_POINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

const useAlchemyWallet = (signer?: Wallet) => {
  const {
    smartSigner,
    paymasterSigner,
    smartAccountAddress,
    setSmartAccountAddress,
    setBaseSigner,
    setPaymasterSigner
  } = useAlchemyProviderContext()

  const sendTransaction = useCallback(async () => {
    if (!paymasterSigner || !smartAccountAddress || !smartSigner?.account || !signer) return

    const target = '0x98CDf5F4D4D7f5b97F84c82fC44F591a239290e4'
    const amount = ethers.utils.parseEther('100')
    const erc20Contract = new ethers.Contract(coinTokenAddress, AirlineCoin.abi)

    // Encode the transfer function call
    const encodedApproveCallData = erc20Contract.interface.encodeFunctionData('approve', [target, amount]) as Hex
    const encodedCallData = erc20Contract.interface.encodeFunctionData('transferFrom', [
      smartAccountAddress,
      target,
      amount
    ]) as Hex
    const res = await smartSigner.account?.encodeExecute(smartAccountAddress, BigInt(0), encodedApproveCallData)

    const { hash: tx1 } = await paymasterSigner.sendUserOperation({
      target,
      data: res as Hex
    })
    await smartSigner.waitForUserOperationTransaction(tx1 as Hex)

    const res2 = await smartSigner.account.encodeExecute(smartAccountAddress, BigInt(0), encodedCallData)
    const { hash: tx2 } = await paymasterSigner.sendUserOperation({
      target,
      data: res2 as Hex
    })

    console.log({ tx2 })
  }, [paymasterSigner, signer, smartAccountAddress, smartSigner])

  const initialize = useCallback(async () => {
    if (!signer) return

    const owner: SimpleSmartAccountOwner = {
      signMessage: async (msg) => signer.signMessage(msg),
      getAddress: async () => signer.address as Hex,
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
      provider: smartSigner.rpcClient,
      policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID_ETH_SEPOLIA || '',
      entryPoint: ENTRY_POINT
    })
    console.log({ smartAccountAddress })

    if (!smartAccountAddress) {
      const address = await smartSigner.account.getAddress()
      setSmartAccountAddress(address)
    }

    setBaseSigner(smartSigner)
    setPaymasterSigner(newPaymasterSigner)
  }, [setBaseSigner, setPaymasterSigner, setSmartAccountAddress, signer, smartAccountAddress])

  useEffect(() => {
    if (!signer) return
    initialize()
  }, [signer, initialize])

  return { sendTransaction }
}

export default useAlchemyWallet
