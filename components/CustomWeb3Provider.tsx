import React, { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { AlchemyAccountProvider } from '@account-kit/react'
import { config, queryClient } from 'config'
import { ThirdwebProvider } from 'thirdweb/react'
import { createThirdwebClient } from 'thirdweb'

interface Props {
  children: ReactNode
}

export const twClient = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_TW_CLIENT_ID })

const CustomWeb3Provider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider config={config} queryClient={queryClient}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </AlchemyAccountProvider>
    </QueryClientProvider>
  )
}

export default CustomWeb3Provider
