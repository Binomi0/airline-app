import { Sepolia } from '@thirdweb-dev/chains'
import React, { ReactNode, useCallback, useEffect } from 'react'
import {
  ThirdwebProvider,
} from '@thirdweb-dev/react'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { Wallet } from 'ethers'
import axios from 'config/axios'
import { useAuthProviderContext } from 'context/AuthProvider'
import { SimpleSmartContractAccount, SmartAccountProvider, type SimpleSmartAccountOwner, Hex } from '@alchemy/aa-core'
import { sepolia } from '@wagmi/chains'
import { withAlchemyGasManager } from '@alchemy/aa-alchemy'

const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454'
const ENTRY_POINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

interface Props {
  children: ReactNode
}

const CustomWeb3Provider = ({ children }: Props) => {
  const {user} = useAuthProviderContext()
  const {
    smartAccountAddress,
    setSmartAccountAddress,
    setBaseSigner,
    setSmartSigner,
    setPaymasterSigner
  } = useAlchemyProviderContext()

  const initialize = useCallback(async (signer: Wallet) => {
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
      policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID_ETH_SEPOLIA || '',
      entryPoint: ENTRY_POINT
    })

    if (!smartAccountAddress) {
      const address = await smartSigner.account.getAddress()

      if (user) {
        await axios.post('/api/wallet', {
          id: user.id,
          smartAccountAddress: address,
          signerAddress: signer.address
        })
      }
      setSmartAccountAddress(address)
    }

    setBaseSigner(signer)
    setSmartSigner(smartSigner)
    setPaymasterSigner(newPaymasterSigner)
  }, [setBaseSigner, setPaymasterSigner, setSmartAccountAddress, setSmartSigner, smartAccountAddress, user])


  const authUser = useCallback(() => {
    if (!user?.id) {
      throw new Error('Missing user ID')
    }
    const base64Key = localStorage.getItem(user.id)
    if (!base64Key) return

    const key = Buffer.from(base64Key, 'base64').toString()
    const wallet = new Wallet(key)
    setBaseSigner(wallet)
    initialize(wallet)
  }, [user?.id, setBaseSigner, initialize])

  const removeUser = useCallback(() => {
    setBaseSigner(undefined)
  }, [setBaseSigner])

  useEffect(() => {
    if (user) authUser()
    else if (!user) removeUser()
  }, [authUser, removeUser, user])

  return (
    <ThirdwebProvider
      clientId={process.env['NEXT_PUBLIC_TW_SECRET_ID']}
      secretKey={process.env['NEXT_PUBLIC_TW_SECRET_KEY']}
      dAppMeta={{
        name: 'Airline App',
        description: 'Decentralized Virtual Airline',
        logoUrl: 'https://airline.onrubia.es/logo.png',
        url: 'https://airline.onrubia.es',
        isDarkMode: true
      }}
      activeChain={Sepolia}
      supportedChains={[Sepolia]}
      // authConfig={{
      //   domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN as string,
      //   authUrl: '/api/auth'
      // }}
      // autoConnect
      // signer={baseSigner}
      // supportedWallets={[
      //   smartWallet({
      //     enableConnectApp: true,
      //     factoryAddress,
      //     gasless: true,
      //     personalWallets: [localWalletConfig]
      //   }),
      //   metamaskWallet(),
      //   coinbaseWallet(),
      //   walletConnect(),
      //   safeWallet()
      // ]}
    >
      {children}
    </ThirdwebProvider>
  )
}

export default CustomWeb3Provider
