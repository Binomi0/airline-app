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
  px: 2,
  py: 0.5,
  borderRadius: '30px',
  background: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : theme.palette.common.white,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
  backdropFilter: 'blur(8px)',
  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
  padding: '4px 16px'
}))

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(4),
  marginTop: theme.spacing(4),
  '& > div': {
    textAlign: 'center'
  }
}))

interface MarketplaceHeaderProps {
  totalListings: number
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({ totalListings }) => {
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
          sx={(theme) => ({
            letterSpacing: '-0.06em',
            mb: 2,
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${theme.palette.slate.light} 100%)`
                : `linear-gradient(135deg, ${theme.palette.slate.dark} 0%, ${theme.palette.slate.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '3rem', md: '5.5rem' },
            lineHeight: 0.9,
            textShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.1)}`
          })}
        >
          Mercado de <span style={{ color: useTheme().palette.indigo.main }}>Flotas</span>
        </Typography>

        <Typography
          variant='h6'
          sx={{
            opacity: 0.8,
            maxWidth: '800px',
            margin: '0 auto',
            fontWeight: 500,
            lineHeight: 1.6,
            fontSize: '1.25rem',
            color: 'text.secondary'
          }}
        >
          Adquiere, vende o alquila aeronaves certificadas. El centro neurálgico para expandir tu alcance operativo.
        </Typography>
      </TitleContainer>

      <StatsContainer>
        <Box>
          <Typography variant='h4' fontWeight={800}>
            {totalListings}
          </Typography>
          <Typography variant='caption' color='text.secondary' fontWeight={700}>
            LISTADOS ACTIVOS
          </Typography>
        </Box>
        <Box>
          <Typography variant='h4' fontWeight={800}>
            2.4k
          </Typography>
          <Typography variant='caption' color='text.secondary' fontWeight={700}>
            VOLUMEN (AIRL)
          </Typography>
        </Box>
        <Box>
          <Typography variant='h4' fontWeight={800}>
            14
          </Typography>
          <Typography variant='caption' color='text.secondary' fontWeight={700}>
            MODELOS DISPONIBLES
          </Typography>
        </Box>
      </StatsContainer>
    </HeaderContainer>
  )
}

export default MarketplaceHeader
