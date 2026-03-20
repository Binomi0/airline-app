import { createContext, useContext } from 'react'
import { VaContextProps } from './VaProvider.types'

export const VaProviderContext = createContext<VaContextProps>({
  atcs: [],
  towers: [],
  origins: [],
  filter: [''],
  isLoading: false,
  initIvaoAuth: () => {},
  setFilter: () => {},
  initIvaoData: () => {},
  getFlights: () => Promise.resolve()
})

export const useVaProviderContext = (): VaContextProps => {
  const context = useContext(VaProviderContext)
  if (context === undefined) {
    throw new Error('useVaProviderContext must be used within a VaProvider')
  }

  return context
}

export const useVaProvider = () => useContext(VaProviderContext)
