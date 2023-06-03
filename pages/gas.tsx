import { ConnectWallet, useAddress, useBalance, useUser } from '@thirdweb-dev/react'
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
import GppGoodIcon from '@mui/icons-material/GppGood'

const Gas: NextPage = () => {
  const { data } = useBalance(rewardTokenAddress)
  const address = useAddress()
  const { isLoading, isLoggedIn } = useUser()

  if (isLoading) {
    return <LinearProgress />
  }

  if (!isLoggedIn) {
    return (
      <Box mt={10} textAlign='center'>
        <GppGoodIcon sx={{ fontSize: 72 }} color='primary' />
        <Typography variant='h2' paragraph>
          Sign in
        </Typography>
        <Typography variant='h4' paragraph>
          Sign in with your wallet to checkout gas station.
        </Typography>
        <ConnectWallet />
      </Box>
    )
  }

  if (!data) return null

  return (
    <Box sx={{ position: 'relative' }}>
      <Image priority className={styles.background} src={image} alt='banner' fill />

      <Container>
        <Stack direction='row-reverse'>
          <Stack direction='row' alignItems='center' spacing={1}>
            <LocalGasStationIcon />
            <Typography variant='h2'>{formatNumber(Number(data.displayValue))}</Typography>
            <Typography variant='h6'>{data.symbol}</Typography>
          </Stack>
        </Stack>
        <Box my={2} textAlign='center'>
          <Typography variant='h1'>Gas Station</Typography>
          {!address && <ConnectWallet />}
        </Box>

        <GasStationView />
      </Container>
    </Box>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default Gas
