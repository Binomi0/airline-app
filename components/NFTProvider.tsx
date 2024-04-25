import { ReactNode } from 'react'
import { AircraftProvider } from 'context/AircraftProvider'
import { LicenseProvider } from 'context/LicenseProvider'

interface Props {
  children: ReactNode
}

const NFTProvider = ({ children }: Props) => (
  <AircraftProvider>
    <LicenseProvider>{children}</LicenseProvider>
  </AircraftProvider>
)

export default NFTProvider
