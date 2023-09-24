import React, { useState } from 'react'
import { NextPage } from 'next'
import { NFT } from '@thirdweb-dev/react'
import CargoView from 'routes/Cargo/CargoView'
import { Box, Container, LinearProgress, Typography } from '@mui/material'
import CargoAircraftSelector from 'routes/Cargo/components/CargoAircraftSelector'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { VaProvider } from 'context/VaProvider'
import Disconnected from 'components/Disconnected'
import { useRouter } from 'next/router'
import useAuth from 'hooks/useAuth'
import { useAircraftProviderContext } from 'context/AircraftProvider/AircraftProvider.context'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'

const CargoPage: NextPage<{ loading: boolean }> = ({ loading }) => {
  const router = useRouter()
  const { user } = useAuth()
  const [aircraft, setAircraft] = useState<NFT>()
  const { ownedAircrafts, isLoading } = useAircraftProviderContext()
  const { live } = useLiveFlightProviderContext()

  React.useEffect(() => {
    if (live) router.push('/live')
  }, [live, router])

  if (!user) {
    return <Disconnected />
  }

  if (isLoading) {
    return <LinearProgress />
  }

  if (ownedAircrafts.length === 0) {
    return (
      <Box>
        <Container>
          <Box mt={10}>
            <Typography>Tienes que tener al menos 1 aeronave para acceder a esta sección.</Typography>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <VaProvider>
      {aircraft ? (
        <CargoView loading={loading} aircraft={aircraft} />
      ) : (
        <CargoAircraftSelector owned={ownedAircrafts} setAircraft={setAircraft} />
      )}
    </VaProvider>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default CargoPage
