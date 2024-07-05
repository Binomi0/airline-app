import { AircraftProvider } from 'context/AircraftProvider'
import { LicenseProvider } from 'context/LicenseProvider'

interface Props {
  children: JSX.Element
}

const NFTProvider = ({ children }: Props) => (
  <AircraftProvider>
    <LicenseProvider>
      <div>{children}</div>
    </LicenseProvider>
  </AircraftProvider>
)

export default NFTProvider
