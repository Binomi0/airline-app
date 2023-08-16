import { createContext, useContext } from 'react'
import { AlchemyContextProps } from './AlchemyProvider.types'

export const AlchemyProviderContext = createContext<AlchemyContextProps | undefined>(undefined)

export const useAlchemyProviderContext = (): AlchemyContextProps => {
  const context = useContext(AlchemyProviderContext)
  if (context === undefined) {
    throw new Error('useAlchemyProviderContext must be used within a AlchemyProvider')
  }

  return context
}
