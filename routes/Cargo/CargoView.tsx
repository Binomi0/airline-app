import React, { useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import styles from 'styles/Home.module.css'
import image from 'public/img/airplanes9.png'
import { useVaProviderContext } from 'context/VaProvider'
import { FRoute, Flight } from 'types'
import useCargo from 'hooks/useCargo'
import { NFT } from '@thirdweb-dev/react'
import NoAddress from 'routes/Cargo/components/NoAddress'
import CargoReady from 'routes/Cargo/components/CargoReady'
import CargoList from 'routes/Cargo/components/CargoList'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'

const initialState: FRoute = {
  origin: '',
  destination: ''
}

const CargoView: NextPage<{ loading: boolean; aircraft?: NFT }> = ({ loading, aircraft }) => {
  const router = useRouter()
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const { newCargo, cargo, completed, getCargo } = useCargo()
  const { flights } = useVaProviderContext()
  const [selected, setSelected] = useState(initialState)
  const flightList = Object.entries(flights as Flight)

  React.useEffect(() => {
    const { origin, destination, callsign } = router.query
    if (origin && destination && callsign && aircraft) {
      setSelected({ origin: origin as string, destination: destination as string })
      newCargo({ origin: origin as string, destination: destination as string }, aircraft, callsign as string, true)
    }
  }, [aircraft, newCargo, router.query])

  React.useEffect(() => {
    getCargo()
  }, [getCargo])

  if (loading || !flights) {
    return <LinearProgress />
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Image priority className={styles.background} src={image} alt='banner' fill />
      <Container>
        <NoAddress />

        <Fade in={!!address && !!selected.origin} unmountOnExit>
          <Box>
            <Typography>Completed Cargos: {completed}</Typography>
            <CargoReady cargo={cargo} onCancel={() => setSelected(initialState)} />
          </Box>
        </Fade>
        <Fade in={!!address && !selected.origin} unmountOnExit>
          <Box>
            <CargoList aircraft={aircraft} flights={flightList} newCargo={newCargo} setSelected={setSelected} />
          </Box>
        </Fade>
        <Fade in={flightList.length < 2} unmountOnExit>
          <Box textAlign='center'>
            {flightList.length === 0 && (
              <Typography variant='h4' color='white'>
                No hay control en torre activo en este momento en España
              </Typography>
            )}
            <Alert severity='info' action={<Button onClick={() => {}}>Actualizar</Button>}>
              <AlertTitle>
                Se necesitan un mínimo de 2 torres de control contectadas simultáneamente para poder realizar una ruta.
              </AlertTitle>
            </Alert>
          </Box>
        </Fade>
        <Fade in={!address} unmountOnExit>
          <Box maxWidth={500} m='auto'>
            <Alert severity='warning'>
              <AlertTitle>ACCESO NO PERMITIDO</AlertTitle>
              <Typography gutterBottom>
                Tienes que conectar e iniciar sesión con tu cuenta para poder ver los vuelos disponibles.
              </Typography>
              {address && (
                <Typography paragraph variant='body2'>
                  Para acceder, tendrás que demostrar con una firma que eres el legítimo dueño de la cuenta con la que
                  estás intentando conectar.
                </Typography>
              )}
            </Alert>
          </Box>
        </Fade>
      </Container>
    </Box>
  )
}

export default CargoView
