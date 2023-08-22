import { Sepolia } from '@thirdweb-dev/chains'
import React, { ReactNode, useCallback, useEffect } from 'react'
import { factoryAddress } from 'contracts/address'
import {
  ThirdwebProvider,
  coinbaseWallet,
  localWallet,
  metamaskWallet,
  safeWallet,
  smartWallet,
  walletConnect
} from '@thirdweb-dev/react'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { useAuthProviderContext } from 'context/AuthProvider'
import { Wallet } from 'ethers'

interface Props {
  children: ReactNode
}

const CustomWeb3Provider = ({ children }: Props) => {
  const localWalletConfig = localWallet()
  const { user } = useAuthProviderContext()
  const { setBaseSigner } = useAlchemyProviderContext()

  const authUser = useCallback(() => {
    const id = localStorage.getItem('wallet-key')
    if (!id) return

    const base64Key = localStorage.getItem(id)
    if (!base64Key) return

    const key = Buffer.from(base64Key, 'base64').toString()
    const wallet = new Wallet(key)
    setBaseSigner(wallet)
  }, [setBaseSigner])

  useEffect(() => {
    if (user) authUser()
  }, [authUser, user])

  return (
    <ThirdwebProvider
      clientId={process.env['NEXT_PUBLIC_TW_SECRET_ID']}
      secretKey={process.env['NEXT_PUBLIC_TW_SECRET_KEY']}
      dAppMeta={{
        name: 'Airline App',
        description: 'Decentralized Virtual Airline',
        logoUrl: 'https://example.com/logo.png',
        url: 'https://airline-app-binomio.vercel.app',
        isDarkMode: true
      }}
      activeChain={Sepolia}
      supportedChains={[Sepolia]}
      // authConfig={{
      //   domain: process.env['NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN'] || '',
      //   authUrl: '/api/auth'
      // }}
      // autoConnect
      // signer={baseSigner}
      supportedWallets={[
        smartWallet({
          enableConnectApp: true,
          factoryAddress,
          gasless: true,
          personalWallets: [localWalletConfig]
        }),
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        safeWallet()
      ]}
    >
      {children}
    </ThirdwebProvider>
  )
}

export default CustomWeb3Provider
