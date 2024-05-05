import { ReactNode, useEffect, useMemo, useState } from 'react'
import axios from 'config/axios'
import { AircraftProvider } from 'context/AircraftProvider'
import { LicenseProvider } from 'context/LicenseProvider'
import { Nft } from 'alchemy-sdk'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'

interface Props {
  // eslint-disable-next-line no-unused-vars
  children: ReactNode
}

const NFTProvider = ({ children }: Props) => {
  const user = useRecoilValue(userState)
  const [fetched, setFetched] = useState(false)
  const [nfts, setNfts] = useState<Nft[]>([])

  useEffect(() => {
    if (fetched || !user) return
    axios.get('/api/alchemy/nfts').then((r) => {
      setFetched(true)
      setNfts(r.data.nfts)
    })
  }, [fetched, user])
  return (
    <AircraftProvider nfts={nfts}>
      <LicenseProvider>{children}</LicenseProvider>
    </AircraftProvider>
  )
}

export default NFTProvider
