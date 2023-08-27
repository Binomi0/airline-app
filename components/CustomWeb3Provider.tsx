import { Sepolia } from '@thirdweb-dev/chains'
import React, { ReactNode } from 'react'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import useWallet from 'hooks/useWallet'
import { useAuthProviderContext } from 'context/AuthProvider'

interface Props {
  children: ReactNode
}

const CustomWeb3Provider = ({ children }: Props) => {
  const { user } = useAuthProviderContext()
  const { initWallet, isLoaded } = useWallet()

  React.useEffect(() => {
    if (user?.id && !isLoaded) initWallet(user.id)
  }, [initWallet, isLoaded, user?.id])

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
