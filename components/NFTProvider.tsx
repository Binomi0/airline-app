import { ReactNode, useMemo } from 'react'
import axios from 'config/axios'
import { AircraftProvider } from 'context/AircraftProvider'
import { LicenseProvider } from 'context/LicenseProvider'

interface Props {
  // eslint-disable-next-line no-unused-vars
  children: ReactNode
}

const NFTProvider = ({ children }: Props) => {
  const nfts = useMemo(() => axios.get('api/alchemy/nfts').then((r) => r.data.nfts), [])
  return (
    <AircraftProvider nfts={nfts}>
      <LicenseProvider>{children}</LicenseProvider>
    </AircraftProvider>
  )
}

export default NFTProvider
