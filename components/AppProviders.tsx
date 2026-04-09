import React, { ReactNode } from 'react'
import { AuthProvider } from 'context/AuthProvider'
import { ThirdwebProvider } from 'thirdweb/react'
import { ContractProvider } from 'context/ContractProvider'
import NFTProvider from 'context/NFTProvider'
import { TokenProvider } from 'context/TokenProvider'
import { VaProvider } from 'context/VaProvider'
import { LiveFlightsProvider } from 'context/LiveFlightProvider'
import { MainProvider } from 'context/MainProvider'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from 'config'

interface Props {
  children: ReactNode
}

/**
 * Combines all global application providers to avoid "Context Hell" in _app.tsx.
 * Providers are ordered logically from lowest level dependencies to highest.
 */
export const AppProviders = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThirdwebProvider>
          <ContractProvider>
            <NFTProvider>
              <TokenProvider>
                <VaProvider>
                  <LiveFlightsProvider>
                    <MainProvider>{children}</MainProvider>
                  </LiveFlightsProvider>
                </VaProvider>
              </TokenProvider>
            </NFTProvider>
          </ContractProvider>
        </ThirdwebProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
