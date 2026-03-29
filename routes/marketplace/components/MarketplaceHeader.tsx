import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, alpha, useTheme } from '@mui/material/styles'

const HeaderContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center'
}))

const TitleContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}))

const Badge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '30px',
  background:
    theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
  backdropFilter: 'blur(8px)',
  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
  padding: '6px 20px'
}))

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(3),
  marginTop: theme.spacing(6),
  maxWidth: '900px',
  margin: `${theme.spacing(6)} auto 0`,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2)
  }
}))

const StatCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '24px',
  background:
    theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.3) : alpha(theme.palette.common.white, 0.6),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    borderColor: theme.palette.primary.main,
    boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.1)}`
  }
}))

interface MarketplaceHeaderProps {
  totalListings: number
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({ totalListings }) => {
  const theme = useTheme()

  return (
    <HeaderContainer>
      <Badge>
        <Typography variant='caption' fontWeight={900} sx={{ letterSpacing: '2px', textTransform: 'uppercase' }}>
          Aeronaves & Activos
        </Typography>
      </Badge>

      <TitleContainer>
        <Typography
          variant='h1'
          fontWeight={950}
          sx={{
            letterSpacing: '-0.04em',
            mb: 2,
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${alpha(theme.palette.common.white, 0.7)} 100%)`
                : `linear-gradient(135deg, ${theme.palette.slate.dark} 0%, ${theme.palette.slate.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2.5rem', md: '5rem' },
            lineHeight: 1,
            textShadow:
              theme.palette.mode === 'dark'
                ? `0 10px 40px ${alpha(theme.palette.common.black, 0.5)}`
                : `0 10px 30px ${alpha(theme.palette.common.black, 0.1)}`
          }}
        >
          Mercado de <span style={{ color: theme.palette.primary.main }}>Flotas</span>
        </Typography>

        <Typography
          variant='h6'
          sx={{
            opacity: 0.9,
            maxWidth: '700px',
            margin: '0 auto',
            fontWeight: 500,
            lineHeight: 1.5,
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: 'text.secondary',
            textShadow: theme.palette.mode === 'dark' ? `0 2px 10px ${alpha(theme.palette.common.black, 0.5)}` : 'none'
          }}
        >
          Adquiere, vende o alquila aeronaves certificadas. El centro neurálgico para expandir tu alcance operativo.
        </Typography>
      </TitleContainer>

      <StatsContainer>
        <StatCard>
          <Typography variant='h3' fontWeight={900} color='primary.main' sx={{ letterSpacing: '-1px', lineHeight: 1 }}>
            {totalListings}
          </Typography>
          <Typography variant='caption' color='text.secondary' fontWeight={800} sx={{ letterSpacing: 1 }}>
            LISTADOS ACTIVOS
          </Typography>
        </StatCard>

        <StatCard>
          <Typography variant='h3' fontWeight={900} color='primary.main' sx={{ letterSpacing: '-1px', lineHeight: 1 }}>
            2.4k
          </Typography>
          <Typography variant='caption' color='text.secondary' fontWeight={800} sx={{ letterSpacing: 1 }}>
            VOLUMEN (AIRL)
          </Typography>
        </StatCard>

        <StatCard>
          <Typography variant='h3' fontWeight={900} color='primary.main' sx={{ letterSpacing: '-1px', lineHeight: 1 }}>
            14
          </Typography>
          <Typography variant='caption' color='text.secondary' fontWeight={800} sx={{ letterSpacing: 1 }}>
            MODELOS
          </Typography>
        </StatCard>
      </StatsContainer>
    </HeaderContainer>
  )
}

export default MarketplaceHeader
