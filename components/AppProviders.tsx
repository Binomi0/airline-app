import React, { ReactNode } from 'react'
import { AuthProvider } from 'context/AuthProvider'
import CustomWeb3Provider from 'components/CustomWeb3Provider'
import { ContractProvider } from 'context/ContractProvider'
import NFTProvider from 'context/NFTProvider'
import { TokenProvider } from 'context/TokenProvider'
import { VaProvider } from 'context/VaProvider'
import { LiveFlightsProvider } from 'context/LiveFlightProvider'
import { MainProvider } from 'context/MainProvider'

interface Props {
  children: ReactNode
}

/**
 * Combines all global application providers to avoid "Context Hell" in _app.tsx.
 * Providers are ordered logically from lowest level dependencies to highest.
 */
export const AppProviders = ({ children }: Props) => {
  return (
    <AuthProvider>
      <CustomWeb3Provider>
        <ContractProvider>
          <NFTProvider>
            <TokenProvider>
              <VaProvider>
                <LiveFlightsProvider>
                  <MainProvider>
                    {children}
                  </MainProvider>
                </LiveFlightsProvider>
              </VaProvider>
            </TokenProvider>
          </NFTProvider>
        </ContractProvider>
      </CustomWeb3Provider>
    </AuthProvider>
  )
}
