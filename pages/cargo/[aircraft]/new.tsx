import { VaProvider } from 'context/VaProvider'
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
import { ownedAircraftNftStore } from 'store/aircraftNFT.atom'

const CargoAircraft = () => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const ownedAircrafts = useRecoilValue(ownedAircraftNftStore)
  const { live } = useLiveFlightProviderContext()

  React.useEffect(() => {
    if (live) router.push('/live')
  }, [live, router])

  React.useEffect(() => {
    if (!user) {
      router.push('/cargo')
    }
  }, [user, router])

  React.useEffect(() => {
    if (!!ownedAircrafts) {
      router.push('/hangar')
    }
  }, [ownedAircrafts, router])

  if (!user) {
    return <Disconnected />
  }

  return (
    <VaProvider>
      <Fade in={!ownedAircrafts}>
        <Box>
          <LinearProgress />
        </Box>
      </Fade>
      <Fade in={!!ownedAircrafts}>
        <Box>
          <CargoView aircraft={ownedAircrafts?.find((a) => a.id.toString() === router.query.aircraft)} />
        </Box>
      </Fade>
    </VaProvider>
  )
}

export default CargoAircraft
