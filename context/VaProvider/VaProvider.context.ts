import { createContext, useContext } from 'react'
import { VaContextProps } from './VaProvider.types'

export const VaProviderContext = createContext<VaContextProps | undefined>(undefined)

export const useVaProviderContext = (): VaContextProps => {
  const context = useContext(VaProviderContext)
  if (context === undefined) {
    throw new Error('useVaProviderContext must be used within a VaProvider')
  }

  return context
}
