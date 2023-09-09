import { createContext, useContext } from 'react'
import { TokenContextProps } from './TokenProvider.types'

export const TokenProviderContext = createContext<TokenContextProps | undefined>(undefined)

export const useTokenProviderContext = (): TokenContextProps => {
  const context = useContext(TokenProviderContext)
  if (context === undefined) {
    throw new Error('useTokenProviderContext must be used within a TokenProvider')
  }

  return context
}
