import React, { useState } from 'react'
import { NextPage } from 'next'
import { NFT } from '@thirdweb-dev/react'
import CargoView from 'routes/Cargo/CargoView'
import CargoAircraftSelector from 'routes/Cargo/components/CargoAircraftSelector'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { VaProvider } from 'context/VaProvider'
import Disconnected from 'components/Disconnected'
import { useRouter } from 'next/router'
import { useAircraftProviderContext } from 'context/AircraftProvider/AircraftProvider.context'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import LinearProgress from '@mui/material/LinearProgress'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'

const CargoPage: NextPage<{ loading: boolean }> = ({ loading }) => {
  const router = useRouter()
  const user = useRecoilValue(userState)
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
      <Container>
        <Stack height='calc(100vh - 64px)' alignItems='center' justifyContent='center' spacing={2}>
          <Typography variant='h4'>Tienes que tener al menos 1 aeronave para acceder a esta sección.</Typography>
          <Button variant='contained' onClick={() => router.push('/hangar')}>
            Ir al Hangar
          </Button>
        </Stack>
      </Container>
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
