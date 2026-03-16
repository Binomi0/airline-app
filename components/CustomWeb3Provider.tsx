import React, { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from 'config'
import { ThirdwebProvider } from 'thirdweb/react'

interface Props {
  children: ReactNode
}

const CustomWeb3Provider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>{children}</ThirdwebProvider>
    </QueryClientProvider>
  )
}

export default CustomWeb3Provider
