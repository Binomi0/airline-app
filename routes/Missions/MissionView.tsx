import React, { useEffect } from 'react'
import Image from 'next/image'
import styles from 'styles/Home.module.css'
import image from 'public/img/airplanes9.png'
import useMission from 'hooks/useMission'
import NoAddress from 'routes/Missions/components/NoAddress'
import MissionReady from 'routes/Missions/components/MissionReady'
import MissionList from 'routes/Missions/components/MissionList'
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

type Props = {
  aircraft?: INft
}

const MissionView = ({ aircraft }: Props) => {
  const address = useRecoilValue(smartAccountAddressStore)
  const { reserveMission, mission, pool, completed, getMission, getPool, isLoading } = useMission()

  useEffect(() => {
    getMission()
    getPool()
  }, [getMission, getPool])

  return (
    <Box sx={{ position: 'relative' }}>
      <Image priority className={styles.background} src={image} alt='banner' fill />
      {isLoading && <LinearProgress />}

      <Container>
        <NoAddress />

        <Fade in={!!address && !!mission} unmountOnExit>
          <Box>
            <Typography color='common.white' variant='h5' gutterBottom>
              Misiones Completadas: {completed}
            </Typography>
            <MissionReady mission={mission} onCancel={() => {}} />
          </Box>
        </Fade>

        <Fade in={!!address && !mission} unmountOnExit>
          <Box>
            <MissionList 
              aircraft={aircraft} 
              pool={pool} 
              reserveMission={reserveMission} 
            />
          </Box>
        </Fade>

        <Fade in={pool.length === 0 && !mission && !isLoading} unmountOnExit>
          <Box textAlign='center' sx={{ mt: 4 }}>
            <Typography variant='h4' color='white' sx={{ mb: 2 }}>
              No hay misiones disponibles en la bolsa común.
            </Typography>
            <Alert severity='info' action={<Button onClick={() => getPool()}>Actualizar</Button>}>
              <AlertTitle>Se generan nuevas misiones periódicamente basadas en el tráfico real de IVAO.</AlertTitle>
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
