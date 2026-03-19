import GasStationView from 'routes/gas/GasStationView'
import styles from 'styles/Gas.module.css'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import { formatNumber } from 'utils'
import Disconnected from 'components/Disconnected'
import { useTokenProviderContext } from 'context/TokenProvider'
import { useReadContract } from 'thirdweb/react'
import { useAppContracts } from 'hooks/useAppContracts'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { tokenBalanceStore } from 'store/balance.atom'

const Gas = () => {
  const user = useRecoilValue(userState)
  const address = useRecoilValue(smartAccountAddressStore)
  const balance = useRecoilValue(tokenBalanceStore)
  const { getAirlBalance, getAirgBalance } = useTokenProviderContext()
  const { stakingContract: contract } = useAppContracts()

  const { data: staking, refetch: getStakingInfo } = useReadContract({
    contract: contract!,
    method:
      'function stakers(address) view returns (uint256 amountStaked, uint256 timeOfLastUpdate, uint256 unclaimedRewards, uint256 conditionIdOflastUpdate)',
    params: [address!]
  })

  if (!user) {
    return <Disconnected />
  }

  return (
    <Box className={styles.pageContainer}>
      <div className={styles.backgroundOverlay} />

      <Container className={styles.contentWrapper}>
        <Box display='flex' justifyContent='flex-end' mb={2}>
          <Box className={styles.headerBalance}>
            <LocalGasStationIcon className={styles.gasIcon} />
            <Typography variant='h6' fontWeight={700}>
              {formatNumber(Number(balance.airg !== undefined ? balance.airg / 10n ** 18n : 0n))}
            </Typography>
            <Typography variant='caption' sx={{ opacity: 0.6, fontWeight: 600 }}>
              AIRG
            </Typography>
          </Box>
        </Box>

        <Box className={styles.titleSection}>
          <Typography variant='h1' fontWeight={800} sx={{ letterSpacing: '-2px', mb: 1 }}>
            Gas <span style={{ color: '#6366f1' }}>Station</span>
          </Typography>
          <Typography variant='h6' sx={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
            Reposta tus tanques y mantén tu flota en el aire convirtiendo AIRL en combustible.
          </Typography>
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
