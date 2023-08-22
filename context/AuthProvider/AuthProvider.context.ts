import { createContext, useContext } from 'react'
import { AuthContextProps } from './AuthProvider.types'

export const AuthProviderContext = createContext<AuthContextProps | undefined>(undefined)

export const useAuthProviderContext = (): AuthContextProps => {
  const context = useContext(AuthProviderContext)
  if (context === undefined) {
    throw new Error('useAuthProviderContext must be used within a AuthProvider')
  }

  return context
}
