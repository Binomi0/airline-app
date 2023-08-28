import type { NextPage } from 'next'
import { Box, Container, LinearProgress, Stack, Typography } from '@mui/material'
import GasStationView from 'routes/gas/GasStationView'
import styles from 'styles/Gas.module.css'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import { rewardTokenAddress } from 'contracts/address'
import Image from 'next/image'
import image from 'public/img/airplanes.png'
import { formatNumber } from 'utils'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useTokenBalance from 'hooks/useTokenBalance'
import Disconnected from 'components/Disconnected'

interface Props {
  loading: boolean
}

const Gas: NextPage<Props> = ({ loading }) => {
  const { balance } = useTokenBalance(rewardTokenAddress)
  const { smartAccountAddress: address } = useAlchemyProviderContext()

  if (loading) {
    return <LinearProgress />
  }

  if (!address) {
    return <Disconnected />
  }

  if (!balance) return null

  return (
    <Box sx={{ position: 'relative' }}>
      <Image priority className={styles.background} src={image} alt='banner' fill />

      <Container>
        <Stack direction='row-reverse'>
          <Stack direction='row' alignItems='center' spacing={1}>
            <LocalGasStationIcon />
            <Typography variant='h2'>{formatNumber(balance.toNumber())}</Typography>
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
