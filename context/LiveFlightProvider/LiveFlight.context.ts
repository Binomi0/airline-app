import { createContext, useContext } from 'react'
import { LiveFlightContextProps } from './LiveFlight.types'

export const LiveFlightProviderContext = createContext<LiveFlightContextProps | undefined>(undefined)

export const useLiveFlightProviderContext = (): LiveFlightContextProps => {
  const context = useContext(LiveFlightProviderContext)
  if (context === undefined) {
    throw new Error('useLiveFlightProviderContext must be used within a LiveFlightProvider')
  }

  return context
}
