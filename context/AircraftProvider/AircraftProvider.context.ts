import { createContext, useContext } from 'react'
import { AircraftContextProps } from './AircraftProvider.types'

export const AircraftProviderContext = createContext<AircraftContextProps | undefined>(undefined)

export const useAircraftProviderContext = (): AircraftContextProps => {
  const context = useContext(AircraftProviderContext)
  if (context === undefined) {
    throw new Error('useAircraftProviderContext must be used within a AircraftProvider')
  }

  return context
}
