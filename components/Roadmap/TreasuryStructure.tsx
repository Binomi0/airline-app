import { Box, Typography, Paper, Stack } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles'
import SecurityIcon from '@mui/icons-material/Security'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import WalletIcon from '@mui/icons-material/AccountBalanceWallet'

const ToolCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  flex: 1
}))

const TreasuryStructure = () => {
  const theme = useTheme()

  return (
    <Box>
      <Typography variant='body2' color='text.secondary' paragraph>
        La gobernanza de WeiFly utiliza un sistema híbrido para garantizar seguridad y participación comunitaria.
      </Typography>

      <Stack spacing={2} alignItems='center' sx={{ position: 'relative' }}>
        <ToolCard>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, gap: 1 }}>
            <HowToVoteIcon color='secondary' />
            <Typography variant='subtitle1' fontWeight='bold'>
              Snapshot
            </Typography>
          </Box>
          <Typography variant='caption' display='block' color='text.secondary'>
            Votaciones off-chain (sin gas)
          </Typography>
          <Typography variant='caption' display='block' sx={{ mt: 1 }}>
            Decisiones simbólicas y estratégicas
          </Typography>
        </ToolCard>

        <ArrowDownwardIcon color='disabled' />

        <ToolCard sx={{ border: `1px solid ${theme.palette.primary.main}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, gap: 1 }}>
            <SecurityIcon color='primary' />
            <Typography variant='subtitle1' fontWeight='bold'>
              Safe Multisig
            </Typography>
          </Box>
          <Typography variant='caption' display='block' color='text.secondary'>
            2/3 o 3/5 Firmantes en Arbitrum
          </Typography>
          <Typography variant='caption' display='block' sx={{ mt: 1, fontWeight: 'bold' }}>
            Ejecución final de fondos
          </Typography>
        </ToolCard>

        <ArrowDownwardIcon color='disabled' />

        <ToolCard>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, gap: 1 }}>
            <WalletIcon />
            <Typography variant='subtitle1' fontWeight='bold'>
              Protocol Treasury
            </Typography>
          </Box>
          <Typography variant='caption' display='block' color='text.secondary'>
            Gasto aprobado para:
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
            <Typography
              variant='caption'
              sx={{ px: 1, py: 0.25, bgcolor: (theme) => alpha(theme.palette.common.white, 0.1), borderRadius: 1 }}
            >
              Devs
            </Typography>
            <Typography
              variant='caption'
              sx={{ px: 1, py: 0.25, bgcolor: (theme) => alpha(theme.palette.common.white, 0.1), borderRadius: 1 }}
            >
              Audits
            </Typography>
            <Typography
              variant='caption'
              sx={{ px: 1, py: 0.25, bgcolor: (theme) => alpha(theme.palette.common.white, 0.1), borderRadius: 1 }}
            >
              Growth
            </Typography>
          </Box>
        </ToolCard>
      </Stack>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'primary.dark', borderRadius: 2, opacity: 0.9 }}>
        <Typography variant='caption' fontWeight='bold' display='block' gutterBottom>
          Principios de Seguridad:
        </Typography>
        <Typography variant='caption' display='block' sx={{ opacity: 0.8 }}>
          • Multisig requiere mayoría para mover fondos.
        </Typography>
        <Typography variant='caption' display='block' sx={{ opacity: 0.8 }}>
          • Votaciones Snapshot guían la ejecución.
        </Typography>
        <Typography variant='caption' display='block' sx={{ opacity: 0.8 }}>
          • Contratos con Treasury Upgradable.
        </Typography>
      </Box>
    </Box>
  )
}

export default TreasuryStructure
