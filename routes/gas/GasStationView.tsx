import React, { memo } from 'react'
import GasAvailable from './GasAvailable'
import GasDeposited from './GasDeposited'
import GasFarmed from './GasFarmed'
import GasSupply from './components/GasSupply'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import { styled, alpha } from '@mui/material/styles'

const StyledSectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  color: '#6366f1'
}))

interface Props {
  airl?: Readonly<bigint>
  staking?: readonly [bigint, bigint, bigint, bigint]
  getAirlBalance: () => void
  getStakingInfo: () => void
  getAirgBalance: () => void
}

const GasStationView = ({ airl, staking, getAirlBalance, getAirgBalance, getStakingInfo }: Props) => {
  return (
    <Box mt={4}>
      <Paper variant='gasCard' sx={{ mb: 6 }}>
        <StyledSectionHeader>
          <CheckCircleOutlineIcon />
          <Typography variant='h5' fontWeight={800}>
            Checklist de Operaciones
          </Typography>
        </StyledSectionHeader>
        <Typography variant='body1' sx={{ opacity: 0.8, maxWidth: '800px', mb: 2 }}>
          Deposita tus tokens AIRL en el staking para empezar a generar combustible (AIRG) de forma pasiva. El
          combustible es esencial para todas tus misiones de vuelo.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            background: (theme) => alpha(theme.palette.primary.main, 0.05),
            border: (theme) => `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`
          }}
        >
          <GasSupply />
        </Box>
      </Paper>

      <Grid container spacing={4}>
        <GasAvailable airl={airl} getAirlBalance={getAirlBalance} getStakingInfo={getStakingInfo} />
        <GasDeposited staking={staking} getStakingInfo={getStakingInfo} getAirlBalance={getAirlBalance} />
        <GasFarmed getAirgBalance={getAirgBalance} />
      </Grid>

      <Paper variant='gasCard' sx={{ mt: 8 }}>
        <StyledSectionHeader>
          <InfoOutlinedIcon />
          <Typography variant='h4' fontWeight={900}>
            ¿Cómo funciona?
          </Typography>
        </StyledSectionHeader>
        <Typography variant='body1' sx={{ opacity: 0.8, lineHeight: 1.8, mb: 4 }}>
          Para llenar tus tanques y volar, simplemente añade tokens AIRL a la Gas Station. Este mecanismo proporciona un
          flujo constante de gasolina por minuto. Una vez que tengas al menos{' '}
          <Box component='span' sx={{ color: 'primary.main', fontWeight: 700 }}>
            100 litros
          </Box>{' '}
          listos para recolectar, el botón CLAIM se desbloqueará y podrás transferir todo el combustible a tu wallet.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            p: 3,
            borderRadius: 3,
            background: (theme) => alpha(theme.palette.secondary.main, 0.05),
            border: (theme) => `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'secondary.main' }}>
              <LocalFireDepartmentIcon />
              <Typography variant='h6' fontWeight={800}>
                Ratio de Conversión
              </Typography>
            </Box>
            <Typography sx={{ opacity: 0.9 }}>
              Obtendrás <b style={{ color: '#10B981' }}>100 Litros</b> por cada <b style={{ color: '#3B82F6' }}>1 token AIRL</b> stakeado durante 24 horas.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 3,
              py: 1,
              background: (theme) => alpha(theme.palette.background.paper, 0.5),
              borderRadius: 2,
              fontWeight: 800,
              fontSize: '1.2rem'
            }}
          >
            1 AIRL = 100 AIRG / 24h
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default memo(GasStationView)
