import React from 'react'
import { Box, Typography, Paper, Chip, Grid, alpha, useTheme, Avatar } from '@mui/material'
import FoundationIcon from '@mui/icons-material/AccountBalance'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import AutorenewIcon from '@mui/icons-material/Autorenew'

const phases = [
  {
    label: 'FASE 1: FUNDACIÓN',
    range: 'Mes 0-3',
    icon: <FoundationIcon />,
    description:
      'Establecimiento de las bases técnicas del protocolo. Desarrollo de contratos inteligentes con lógica de royalties EIP-2981 y tesorería actualizable para permitir una migración fluida.',
    metrics: ['Smart Contracts MVP', 'Community Launch', 'Royalties Engine'],
    control: 'Fundador (Full Control)',
    status: 'current'
  },
  {
    label: 'FASE 2: CRECIMIENTO & MULTISIG',
    range: 'Mes 3-9',
    icon: <GroupAddIcon />,
    description:
      'Transición del control hacia un modelo de confianza compartida. Creación de Safe Multisig en Arbitrum tras alcanzar 3 meses de ingresos recurrentes.',
    metrics: ['Stable Revenue', 'Safe Implementation', 'Public Dashboard'],
    control: 'Fundador + Colaboradores',
    status: 'upcoming'
  },
  {
    label: 'FASE 3: GOBERNANZA COMUNITARIA',
    range: 'Mes 9-18',
    icon: <HowToVoteIcon />,
    description:
      'Apertura de la gobernanza a los holders de tokens. Implementación de Snapshot para votaciones off-chain vinculantes y expansión de firmantes de la multisig.',
    metrics: ['Governance Token', 'Snapshot Space', 'Community Signers'],
    control: 'Comunidad + Multisig',
    status: 'upcoming'
  },
  {
    label: 'FASE 4: DAO TOTALMENTE AUTÓNOMA',
    range: 'Mes 18+',
    icon: <AutorenewIcon />,
    description:
      'El protocolo alcanza su madurez. Gobernanza on-chain total con contratos autónomos que ejecutan los resultados de las votaciones sin intervención manual.',
    metrics: ['On-chain Governance', 'Total Autonomy', 'Full Sustainability'],
    control: 'DAO Algorítmica / Autónoma',
    status: 'upcoming'
  }
]

const RoadmapTimeline = () => {
  const theme = useTheme()

  return (
    <Box sx={{ position: 'relative', py: 4 }}>
      {/* Central Line */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: '30px', md: '50%' },
          top: 0,
          bottom: 0,
          width: '2px',
          background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.1)})`,
          zIndex: 0,
          transform: { md: 'translateX(-50%)' }
        }}
      />

      {phases.map((phase, index) => {
        const isEven = index % 2 === 0
        const isCurrent = phase.status === 'current'

        return (
          <Box
            key={phase.label}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: isEven ? 'flex-start' : 'flex-end' },
              alignItems: 'center',
              width: '100%',
              mb: 8,
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Dot on Line */}
            <Box
              sx={{
                position: 'absolute',
                left: { xs: '30px', md: '50%' },
                transform: 'translateX(-50%)',
                width: isCurrent ? '24px' : '16px',
                height: isCurrent ? '24px' : '16px',
                borderRadius: '50%',
                bgcolor: isCurrent ? 'primary.main' : 'background.paper',
                border: `3px solid ${theme.palette.primary.main}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isCurrent ? `0 0 15px ${theme.palette.primary.main}` : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {isCurrent && <Box sx={{ width: 8, height: 8, bgcolor: '#fff', borderRadius: '50%' }} />}
            </Box>

            {/* Content Card */}
            <Grid
              container
              justifyContent={{ xs: 'flex-start', md: isEven ? 'flex-end' : 'flex-start' }}
              sx={{ width: { xs: 'calc(100% - 60px)', md: '45%' }, ml: { xs: '60px', md: 0 } }}
            >
              <Paper
                variant='glass'
                sx={{
                  p: 4,
                  borderRadius: 4,
                  width: '100%',
                  border: isCurrent
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.5)}`
                    : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isCurrent ? `0 10px 40px ${alpha(theme.palette.primary.main, 0.1)}` : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                {/* Background Gradeint for Current */}
                {isCurrent && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      p: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      borderBottomLeftRadius: 16
                    }}
                  >
                    <Typography variant='overline' sx={{ fontWeight: 900, color: 'primary.main' }}>
                      ACTUAL
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: isCurrent ? 'primary.main' : 'rgba(255,255,255,0.05)',
                      color: isCurrent ? '#fff' : 'text.secondary',
                      width: 48,
                      height: 48,
                      boxShadow: isCurrent ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
                    }}
                  >
                    {phase.icon}
                  </Avatar>
                  <Box>
                    <Typography
                      variant='h5'
                      sx={{
                        fontWeight: 900,
                        letterSpacing: -0.5,
                        fontSize: '1.25rem',
                        fontFamily: 'Sora, sans-serif'
                      }}
                    >
                      {phase.label}
                    </Typography>
                    <Typography variant='caption' sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>
                      {phase.range}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant='body2' color='text.secondary' sx={{ mb: 3, lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {phase.description}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant='caption' sx={{ fontWeight: 900, display: 'block', mb: 1, opacity: 0.6 }}>
                    HÍTOS CLAVE
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {phase.metrics.map((metric) => (
                      <Chip
                        key={metric}
                        label={metric}
                        size='small'
                        variant='outlined'
                        sx={{
                          borderRadius: 1,
                          fontWeight: 700,
                          borderColor: isCurrent ? alpha(theme.palette.primary.main, 0.3) : 'rgba(255,255,255,0.1)',
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    pt: 2,
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <Box>
                    <Typography variant='caption' sx={{ fontWeight: 900, display: 'block', opacity: 0.5 }}>
                      ESTRUCTURA DE CONTROL
                    </Typography>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>
                      {phase.control}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Box>
        )
      })}
    </Box>
  )
}

export default RoadmapTimeline
