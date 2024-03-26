import GasStationView from 'routes/gas/GasStationView'
import styles from 'styles/Gas.module.css'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import Image from 'next/image'
import image from 'public/img/airplanes.png'
import { formatNumber } from 'utils'
import Disconnected from 'components/Disconnected'
import { useTokenProviderContext } from 'context/TokenProvider'
import { useContract, useContractRead } from '@thirdweb-dev/react'
import { stakingAddress } from 'contracts/address'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import type { PageProps } from 'types'
import LinearProgress from '@mui/material/LinearProgress'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { tokenBalanceStore } from 'store/balance.atom'

const Gas = ({ loading }: PageProps) => {
  const user = useRecoilValue(userState)
  const address = useRecoilValue(smartAccountAddressStore)
  const balance = useRecoilValue(tokenBalanceStore)
  const { getAirlBalance, getAirgBalance } = useTokenProviderContext()
  const { contract } = useContract(stakingAddress)
  const { data: staking, refetch: getStakingInfo } = useContractRead(contract, 'stakers', [address])

  if (!user) {
    return <Disconnected />
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Image priority className={styles.background} src={image} alt='banner' fill />
      {loading && <LinearProgress />}

      <Container>
        <Stack direction='row-reverse'>
          <Stack direction='row' alignItems='center' spacing={1}>
            <LocalGasStationIcon />
            <Typography variant='h2'>{formatNumber(balance.airg?.toNumber())}</Typography>
            <Typography variant='h6'>AIRG</Typography>
          </Stack>
        </Stack>
        <Box my={2} textAlign='center'>
          <Typography variant='h1'>Gas Station</Typography>
        </Box>
        <GasStationView
          staking={staking}
          airl={balance.airl}
          getAirlBalance={getAirlBalance}
          getAirgBalance={getAirgBalance}
          getStakingInfo={getStakingInfo}
        />
      </Container>
    </Box>
  )
}

export default Gas
