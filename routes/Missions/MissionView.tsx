import React, { useState } from 'react'
import Image from 'next/image'
import styles from 'styles/Home.module.css'
import image from 'public/img/airplanes9.png'
import { useVaProviderContext } from 'context/VaProvider'
import { FRoute, Flight } from 'types'
import useMission from 'hooks/useMission'
import NoAddress from 'routes/Missions/components/NoAddress'
import MissionReady from 'routes/Missions/components/MissionReady'
import MissionList from 'routes/Missions/components/MissionList'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { INft } from 'models/Nft'

const initialState: FRoute = {
  origin: '',
  destination: '',
  distance: 0
}

type Props = {
  aircraft?: INft
}

const MissionView = ({ aircraft }: Props) => {
  const router = useRouter()
  const address = useRecoilValue(smartAccountAddressStore)
  const { newMission, mission, completed, getMission } = useMission()
  const { flights, getFlights } = useVaProviderContext()
  const [selected, setSelected] = useState(initialState)
  const flightList = Object.entries(flights as Flight)

  React.useEffect(() => {
    const { origin, destination, callsign } = router.query
    if (origin && destination && callsign && aircraft) {
      if (origin === mission?.origin && destination === mission?.destination && aircraft.id === mission?.aircraftId) {
        return
      }
      setSelected({ origin: origin as string, destination: destination as string, distance: 0 })
      newMission(
        { origin: origin as string, destination: destination as string, distance: 0 },
        aircraft,
        callsign as string,
        true
      )
    }
  }, [aircraft, mission?.aircraftId, mission?.destination, mission?.origin, newMission, router.query])

  React.useEffect(() => {
    getMission()
    getFlights()
  }, [getMission, getFlights])

  return (
    <Box sx={{ position: 'relative' }}>
      <Image priority className={styles.background} src={image} alt='banner' fill />
      {!flights && <LinearProgress />}

      <Container>
        <NoAddress />

        <Fade in={!!address && !!selected.origin} unmountOnExit>
          <Box>
            <Typography color='common.white' variant='h5' gutterBottom>
              Misiones Completadas: {completed}
            </Typography>
            <MissionReady mission={mission} onCancel={() => setSelected(initialState)} />
          </Box>
        </Fade>
        <Fade in={!!address && !selected.origin} unmountOnExit>
          <Box>
            <MissionList aircraft={aircraft} flights={flightList} newMission={newMission} setSelected={setSelected} />
          </Box>
        </Fade>

        <Fade in={flightList.length < 2} unmountOnExit>
          <Box textAlign='center'>
            {flightList.length === 0 && (
              <Typography variant='h4' color='white' sx={{ mb: 2 }}>
                No hay misiones disponibles basadas en torres ATC activas.
              </Typography>
            )}
            <Alert severity='info' action={<Button onClick={() => {}}>Actualizar</Button>}>
              <AlertTitle>Conecta con torres de control activas para desbloquear misiones exclusivas.</AlertTitle>
            </Alert>
          </Box>
        </Fade>

        <Fade in={!address} unmountOnExit>
          <Box maxWidth={500} m='auto'>
            <Alert severity='warning'>
              <AlertTitle>ACCESO NO PERMITIDO</AlertTitle>
              <Typography gutterBottom>
                Tienes que conectar e iniciar sesión con tu cuenta para poder ver las misiones disponibles.
              </Typography>
            </Alert>
          </Box>
        </Fade>
      </Container>
    </Box>
  )
}

export default MissionView
