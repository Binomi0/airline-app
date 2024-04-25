import { useContract, useNFT } from '@thirdweb-dev/react'
import { VaProvider } from 'context/VaProvider'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useRouter } from 'next/router'
import React from 'react'
import CargoView from 'routes/Cargo/CargoView'
import Disconnected from 'components/Disconnected'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import type { PageProps } from 'types'
import { ownedAircraftNftStore } from 'store/aircraftNFT.atom'

const CargoAircraft = ({ loading }: PageProps) => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data, isLoading } = useNFT(contract, router.query.aircraft as string)
  const ownedAircrafts = useRecoilValue(ownedAircraftNftStore)
  const { live } = useLiveFlightProviderContext()

  const hasAircraft = React.useMemo(() => {
    if (!ownedAircrafts || !data) return false
    return ownedAircrafts.some((nft) => nft.metadata.id === data.metadata.id)
  }, [ownedAircrafts, data])

  React.useEffect(() => {
    if (live) router.push('/live')
  }, [live, router])

  React.useEffect(() => {
    if (!user) {
      router.push('/cargo')
    }
  }, [user, router])

  React.useEffect(() => {
    if (!!ownedAircrafts && !!data && !isLoading && !hasAircraft) {
      router.push('/hangar')
    }
  }, [ownedAircrafts, data, isLoading, router, hasAircraft])

  if (!user) {
    return <Disconnected />
  }

  return (
    <VaProvider>
      <Fade in={isLoading || !ownedAircrafts}>
        <Box>
          <LinearProgress />
        </Box>
      </Fade>
      <Fade in={!isLoading && !ownedAircrafts}>
        <Box>{hasAircraft ? <CargoView loading={loading} aircraft={data} /> : null}</Box>
      </Fade>
    </VaProvider>
  )
}

export default CargoAircraft
