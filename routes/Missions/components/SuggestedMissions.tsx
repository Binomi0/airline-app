import React from 'react'
import { Box, Typography, Stack, useTheme, alpha, Paper, Skeleton } from '@mui/material'
import { PublicMission } from 'types'
import { formatNumber } from 'utils'
import { b612Mono } from 'src/theme'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'

interface SuggestedMissionsProps {
  missions: PublicMission[]
  onSelect: (mission: PublicMission) => void
  selectedMission?: PublicMission
  isLoading?: boolean
}

const SuggestedMissions: React.FC<SuggestedMissionsProps> = ({ missions, onSelect, selectedMission, isLoading }) => {
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main

  if (!isLoading && missions.length === 0) return null

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1, px: 1 }}>
        <WorkspacePremiumIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography
          variant='overline'
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            letterSpacing: 2,
            textShadow: `0 0 10px ${alpha(primaryColor, 0.3)}`
          }}
        >
          SUGGESTED MISSIONS
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          pt: 1,
          px: 1,
          '&::-webkit-scrollbar': {
            height: '4px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.05)'
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(primaryColor, 0.3),
            borderRadius: '10px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: alpha(primaryColor, 0.5)
          }
        }}
      >
        {isLoading
          ? [1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                variant='rectangular'
                width={280}
                height={160}
                sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }}
              />
            ))
          : missions.map((mission, index) => {
              const isSelected =
                selectedMission?.destination === mission.destination && selectedMission?.origin === mission.origin
              const isHighReward = mission.rewardMultiplier >= 1.9

              return (
                <Paper
                  key={`${mission.destination}-${index}`}
                  onClick={() => onSelect(mission)}
                  elevation={0}
                  sx={{
                    minWidth: 280,
                    cursor: 'pointer',
                    p: 2,
                    position: 'relative',
                    background: isSelected
                      ? `linear-gradient(135deg, ${alpha(primaryColor, 0.15)} 0%, ${alpha(primaryColor, 0.05)} 100%)`
                      : 'rgba(20, 20, 25, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: isSelected ? alpha(primaryColor, 0.6) : 'rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: alpha(primaryColor, 0.6),
                      boxShadow: `0 8px 24px ${alpha(primaryColor, 0.2)}`,
                      '& .mission-icon': {
                        color: '#fff',
                        transform: 'scale(1.1) rotate(-10deg)'
                      }
                    },
                    fontFamily: b612Mono.style.fontFamily
                  }}
                >
                  {isHighReward && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: 12,
                        bgcolor: 'success.main',
                        color: '#000',
                        px: 1,
                        py: 0.2,
                        borderRadius: 1,
                        fontSize: '0.65rem',
                        fontWeight: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        zIndex: 2
                      }}
                    >
                      <LocalFireDepartmentIcon sx={{ fontSize: 12 }} />
                      TOP FLIGHT
                    </Box>
                  )}

                  <Stack spacing={1.5}>
                    <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
                      <Box>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem', mb: -0.5 }}>ROUTE</Typography>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Typography
                            sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: isSelected ? '#fff' : 'primary.main' }}
                          >
                            {mission.origin}
                          </Typography>
                          <Typography sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>→</Typography>
                          <Typography
                            sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: isSelected ? '#fff' : 'primary.main' }}
                          >
                            {mission.destination}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box
                        className='mission-icon'
                        sx={{ transition: 'all 0.3s ease', color: alpha(primaryColor, 0.6) }}
                      >
                        <FlightTakeoffIcon />
                      </Box>
                    </Stack>

                    <Box>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem', mb: -0.5 }}>PRIZE</Typography>
                      <Typography sx={{ variant: 'h6', fontWeight: 'bold', color: 'success.main' }}>
                        {formatNumber(mission.prize, 0)}{' '}
                        <Typography component='span' sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                          AIRL
                        </Typography>
                      </Typography>
                    </Box>

                    <Stack direction='row' justifyContent='space-between' alignItems='flex-end'>
                      <Box>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>TYPE</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {mission.type || 'CARGO'}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>DIST</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{mission.distance} NM</Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>
              )
            })}
      </Box>
    </Box>
  )
}

export default SuggestedMissions
