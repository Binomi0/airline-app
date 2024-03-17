import { Sepolia } from '@thirdweb-dev/chains'
import React, { ReactNode, useCallback } from 'react'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import useWallet from 'hooks/useWallet'
import { User } from 'types'
import { useRecoilState } from 'recoil'
import { userState } from 'store/user.atom'

interface Props {
  children: ReactNode
}

const CustomWeb3Provider = ({ children }: Props) => {
  const [user, setUser] = useRecoilState(userState)
  const { initWallet, isLoaded } = useWallet()

  const handleInit = useCallback(
    async (_user: User) => {
      try {
        await initWallet(_user)
      } catch (err) {
        console.error('CustomWeb3Provider init err =>', err)
        setUser(undefined)
      }
    },
    [initWallet, setUser]
  )

  React.useEffect(() => {
    if (user && !isLoaded) {
      handleInit(user)
    }
  }, [handleInit, isLoaded, user])

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
