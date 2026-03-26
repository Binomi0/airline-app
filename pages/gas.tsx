import GasStationView from 'routes/gas/GasStationView'
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
import { styled, alpha } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'

const PageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: 'calc(100vh - 64px)',
  padding: theme.spacing(6, 2),
  color: theme.palette.text.primary,
  overflowX: 'hidden',
  background: theme.palette.background.default
}))

const BackgroundOverlay = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage:
    theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${alpha('#0f172a', 0.95)} 0%, ${alpha('#1e293b', 0.85)} 100%), url('/img/airport_bg.png')`
      : `linear-gradient(135deg, ${alpha('#f8fafc', 0.8)} 0%, ${alpha('#cbd5e1', 0.6)} 100%), url('/img/airport_bg.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0
}))

const HeaderBalance = styled(Paper)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.1)
      : alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  width: 'fit-content'
}))

const TitleSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 1
}))

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
    <PageWrapper>
      <BackgroundOverlay />

      <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
        <Box display='flex' justifyContent='flex-end' mb={4}>
          <HeaderBalance elevation={0}>
            <LocalGasStationIcon sx={{ color: 'primary.main' }} />
            <Typography variant='h6' fontWeight={700}>
              {formatNumber(Number(balance.airg !== undefined ? balance.airg / 10n ** 18n : 0n))}
            </Typography>
            <Typography variant='caption' sx={{ opacity: 0.6, fontWeight: 700, letterSpacing: 1 }}>
              AIRG
            </Typography>
          </HeaderBalance>
        </Box>

        <TitleSection>
          <Typography
            variant='h1'
            fontWeight={900}
            sx={{
              letterSpacing: '-0.05em',
              mb: 1,
              background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Gas <span style={{ color: '#6366f1' }}>Station</span>
          </Typography>
          <Typography
            variant='h6'
            sx={{
              opacity: 0.8,
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: 500,
              lineHeight: 1.6
            }}
          >
            Reposta tus tanques y mantén tu flota en el aire convirtiendo AIRL en combustible.
          </Typography>
        </TitleSection>

        <GasStationView
          staking={staking}
          airl={balance.airl}
          getAirlBalance={getAirlBalance}
          getAirgBalance={getAirgBalance}
          getStakingInfo={getStakingInfo}
        />
      </Container>
    </PageWrapper>
  )
}

export default Gas
