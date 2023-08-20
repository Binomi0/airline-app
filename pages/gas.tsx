import { ConnectWallet, useBalance, useUser } from '@thirdweb-dev/react'
import type { NextPage } from 'next'
import { Box, Container, LinearProgress, Stack, Typography } from '@mui/material'
import GasStationView from 'routes/gas/GasStationView'
import styles from 'styles/Gas.module.css'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import { coinTokenAddress, rewardTokenAddress } from 'contracts/address'
import Image from 'next/image'
import image from 'public/img/airplanes.png'
import { formatNumber } from 'utils'
import serverSidePropsHandler from 'components/ServerSideHandler'
import GppGoodIcon from '@mui/icons-material/GppGood'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useTokenBalance from 'hooks/useTokenBalance'

interface Props {
  loading: boolean
}

const Gas: NextPage<Props> = ({ loading }) => {
  const { balance } = useTokenBalance(coinTokenAddress)
  const { smartAccountAddress: address } = useAlchemyProviderContext()

  if (loading) {
    return <LinearProgress />
  }

  if (!address) {
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
