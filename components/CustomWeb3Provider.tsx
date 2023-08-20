import { Sepolia } from '@thirdweb-dev/chains'
import React, { ReactNode, useState } from 'react'
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
import { LocalWallet } from '@thirdweb-dev/wallets'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import encryptedJson from './wallet-9895.json'

interface Props {
  children: ReactNode
}

const CustomWeb3Provider = ({ children }: Props) => {
  const localWalletConfig = localWallet()
  const { baseSigner } = useAlchemyProviderContext()

  return (
    <ThirdwebProvider
      clientId={process.env['NEXT_PUBLIC_TW_CLIENT_ID']}
      dAppMeta={{
        name: 'Airline App',
        description: 'Decentralized Virtual Airline',
        logoUrl: 'https://example.com/logo.png',
        url: 'https://airline-app-binomio.vercel.app',
        isDarkMode: true
      }}
      activeChain={Sepolia}
      supportedChains={[Sepolia]}
      authConfig={{
        domain: process.env['NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN'] || '',
        authUrl: '/api/auth'
      }}
      autoConnect
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
