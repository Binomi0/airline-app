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
import { Wallet } from 'ethers'
import { useSession } from 'next-auth/react'

interface Props {
  children: ReactNode
}

const CustomWeb3Provider = ({ children }: Props) => {
  const localWalletConfig = localWallet()
  const session = useSession()
  const { setBaseSigner } = useAlchemyProviderContext()

  const authUser = useCallback(() => {
    // @ts-ignore
    const base64Key = localStorage.getItem(session.data?.user?.id)
    if (!base64Key) return

    const key = Buffer.from(base64Key, 'base64').toString()
    const wallet = new Wallet(key)
    setBaseSigner(wallet)
  }, [setBaseSigner, session])

  useEffect(() => {
    if (session.status === 'authenticated') authUser()
  }, [authUser, session.status])

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
      authConfig={{
        domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN as string,
        authUrl: '/api/auth'
      }}
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
