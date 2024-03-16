import type { NextPage } from 'next'
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
import { useContract, useContractRead } from '@thirdweb-dev/react'
import { stakingAddress } from 'contracts/address'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface Props {
  loading: boolean
}

const Gas: NextPage<Props> = ({ loading }) => {
  const { user } = useAuth()
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const { airg, airl, getAirlBalance, getAirgBalance } = useTokenProviderContext()
  const { contract } = useContract(stakingAddress)
  const { data: staking, refetch: getStakingInfo } = useContractRead(contract, 'stakers', [address])

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
        <GasStationView
          staking={staking}
          airl={airl}
          getAirlBalance={getAirlBalance}
          getAirgBalance={getAirgBalance}
          getStakingInfo={getStakingInfo}
        />
      </Container>
    </Box>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default Gas
