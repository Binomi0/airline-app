import { Sepolia } from '@thirdweb-dev/chains'
import React, {
  ReactNode
  // useCallback
} from 'react'
import { ThirdwebProvider } from '@thirdweb-dev/react'
// import useWallet from 'hooks/useWallet'
// import { User } from 'types'
// import { useRecoilState } from 'recoil'
// import { userState } from 'store/user.atom'
// import { walletStore } from 'store/wallet.atom'

interface Props {
  children: ReactNode
}

const CustomWeb3Provider = ({ children }: Props) => {
  // const [user, setUser] = useRecoilState(userState)
  // const [wallet] = useRecoilState(walletStore)
  // const { initWallet } = useWallet()

  // const handleInit = useCallback(
  //   async (_user: User) => {
  //     try {
  //       await initWallet(_user)
  //     } catch (err) {
  //       console.error('CustomWeb3Provider init err =>', err)
  //       setUser(undefined)
  //     }
  //   },
  //   [initWallet, setUser]
  // )

  // React.useEffect(() => {
  //   if (user && !wallet.isLoaded) {
  //     handleInit(user)
  //   }
  // }, [handleInit, user, wallet.isLoaded])

  return (
    <ThirdwebProvider
      clientId={process.env['NEXT_PUBLIC_TW_SECRET_ID']}
      secretKey={process.env['NEXT_PUBLIC_TW_SECRET_KEY']}
      dAppMeta={{
        name: 'WeiFy App',
        description: 'Decentralized Virtual Airline',
        logoUrl: 'https://weifly.com/logo.png',
        url: 'https://weifly.com',
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
