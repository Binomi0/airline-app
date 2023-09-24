import { createContext, useContext } from 'react'
import { LicenseContextProps } from './LicenseProvider.types'

export const LicenseProviderContext = createContext<LicenseContextProps | undefined>(undefined)

export const useLicenseProviderContext = (): LicenseContextProps => {
  const context = useContext(LicenseProviderContext)
  if (context === undefined) {
    throw new Error('useLicenseProviderContext must be used within a LicenseProvider')
  }

  return context
}

export const useLicenseProvider = () => useContext(LicenseProviderContext)
