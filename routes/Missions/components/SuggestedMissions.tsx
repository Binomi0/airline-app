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
    <Box style={{ marginBottom: theme.spacing(4) }}>
      <Stack
        direction='row'
        alignItems='center'
        spacing={1}
        style={{
          marginBottom: theme.spacing(1),
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1)
        }}
      >
        <WorkspacePremiumIcon color='primary' style={{ fontSize: 20 }} />
        <Typography
          variant='overline'
          color='primary'
          style={{
            fontWeight: 'bold',
            letterSpacing: 2,
            textShadow: `0 0 10px ${alpha(primaryColor, 0.3)}`
          }}
        >
          SUGGESTED MISSIONS
        </Typography>
      </Stack>

      <Box
        style={{
          display: 'flex',
          gap: theme.spacing(2),
          overflowX: 'auto',
          paddingBottom: theme.spacing(2),
          paddingTop: theme.spacing(1),
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
          scrollbarWidth: 'thin'
        }}
      >
        {isLoading
          ? [1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                variant='rectangular'
                width={280}
                height={160}
                style={{
                  borderRadius: theme.shape.borderRadius * 2,
                  backgroundColor: alpha(theme.palette.divider, 0.05)
                }}
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
                  variant='missionsCard'
                  style={{
                    minWidth: 280,
                    background: isSelected
                      ? `linear-gradient(135deg, ${alpha(primaryColor, 0.15)} 0%, ${alpha(primaryColor, 0.05)} 100%)`
                      : undefined,
                    borderColor: isSelected ? alpha(primaryColor, 0.6) : undefined,
                    fontFamily: b612Mono.style.fontFamily
                  }}
                >
                  {isHighReward && (
                    <Box
                      style={{
                        position: 'absolute',
                        top: -10,
                        right: 12,
                        backgroundColor: theme.palette.success.main,
                        color: theme.palette.common.black,
                        padding: '2px 8px',
                        borderRadius: theme.shape.borderRadius,
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.5)}`,
                        zIndex: 2
                      }}
                    >
                      <LocalFireDepartmentIcon style={{ fontSize: 12 }} />
                      TOP FLIGHT
                    </Box>
                  )}

                  <Stack spacing={1.5}>
                    <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
                      <Box style={{ flex: 1 }}>
                        <Typography color='text.secondary' style={{ fontSize: '0.65rem', marginBottom: -4 }}>
                          ROUTE
                        </Typography>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Typography
                            style={{
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                              color: isSelected ? theme.palette.common.white : primaryColor
                            }}
                          >
                            {mission.origin}
                          </Typography>
                          <Typography color='text.disabled' style={{ fontSize: '0.8rem' }}>
                            →
                          </Typography>
                          <Typography
                            style={{
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                              color: isSelected ? theme.palette.common.white : primaryColor
                            }}
                          >
                            {mission.destination}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box
                        style={{
                          transition: 'all 0.3s ease',
                          color: isSelected ? theme.palette.common.white : alpha(primaryColor, 0.6)
                        }}
                      >
                        <FlightTakeoffIcon />
                      </Box>
                    </Stack>

                    <Box>
                      <Typography color='text.secondary' style={{ fontSize: '0.65rem', marginBottom: -4 }}>
                        PRIZE
                      </Typography>
                      <Typography variant='h6' style={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                        {formatNumber(mission.prize, 0)}{' '}
                        <Typography component='span' style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                          AIRL
                        </Typography>
                      </Typography>
                    </Box>

                    <Stack direction='row' justifyContent='space-between' alignItems='flex-end'>
                      <Box>
                        <Typography color='text.secondary' style={{ fontSize: '0.65rem' }}>
                          TYPE
                        </Typography>
                        <Typography style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {mission.type || 'CARGO'}
                        </Typography>
                      </Box>
                      <Box style={{ textAlign: 'right' }}>
                        <Typography color='text.secondary' style={{ fontSize: '0.65rem' }}>
                          DIST
                        </Typography>
                        <Typography style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {mission.distance} NM
                        </Typography>
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
