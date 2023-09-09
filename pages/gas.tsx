import type { NextPage } from 'next'
import { Box, Container, LinearProgress, Stack, Typography } from '@mui/material'
import GasStationView from 'routes/gas/GasStationView'
import styles from 'styles/Gas.module.css'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import Image from 'next/image'
import image from 'public/img/airplanes.png'
import { formatNumber } from 'utils'
import serverSidePropsHandler from 'components/ServerSideHandler'
import Disconnected from 'components/Disconnected'
import { useTokenProviderContext } from 'context/TokenProvider'
import useAuth from 'hooks/useAuth'

interface Props {
  loading: boolean
}

const Gas: NextPage<Props> = ({ loading }) => {
  const { airg } = useTokenProviderContext()
  const { user } = useAuth()

  if (loading) {
    return <LinearProgress />
  }

  if (!user) {
    return <Disconnected />
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Image priority className={styles.background} src={image} alt='banner' fill />

      <Container>
        <Stack direction='row-reverse'>
          <Stack direction='row' alignItems='center' spacing={1}>
            <LocalGasStationIcon />
            <Typography variant='h2'>{formatNumber(airg?.toNumber())}</Typography>
            <Typography variant='h6'>AIRG</Typography>
          </Stack>
        </Stack>
        <Box my={2} textAlign='center'>
          <Typography variant='h1'>Gas Station</Typography>
        </Box>

        <GasStationView />
      </Container>
    </Box>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default Gas
