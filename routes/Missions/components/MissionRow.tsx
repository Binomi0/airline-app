import React from 'react'
import { Box, Typography, useTheme, alpha, Chip } from '@mui/material'
import { IBaseMission } from 'types'
import { formatNumber } from 'utils'
import moment from 'moment'

interface MissionRowProps {
  mission: IBaseMission
  onSelect: (missionId: string) => void
  isSelected?: boolean
}

const MissionRow: React.FC<MissionRowProps> = ({ mission, onSelect, isSelected }) => {
  const theme = useTheme()

  const primaryColor = theme.palette.primary.main
  const mutedColor = alpha(primaryColor, 0.4)

  return (
    <Box
      onClick={() => onSelect(mission._id!)}
      sx={{
        cursor: 'pointer',
        mb: '2px',
        background: isSelected ? alpha(primaryColor, 0.08) : '#020202',
        border: `1px solid ${isSelected ? alpha(primaryColor, 0.4) : '#121212'}`,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 0.6,
        position: 'relative',
        transition: 'all 0.1s ease',
        '&:hover': {
          background: alpha(primaryColor, 0.05),
          borderColor: alpha(primaryColor, 0.3),
          '& .dot-text': {
            color: '#fff',
            textShadow: `0 0 10px ${primaryColor}`
          }
        },
        fontFamily: "'VT323', monospace",
        textTransform: 'uppercase'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          bgcolor: 'rgba(255,255,255,0.015)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* 1. TIME */}
      <Box sx={{ width: 80, zIndex: 2 }}>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            fontSize: '1.4rem',
            color: isSelected ? '#fff' : primaryColor,
            lineHeight: 1,
            opacity: isSelected ? 1 : 0.8
          }}
        >
          {mission.startTime ? moment(mission.startTime).format('HH:mm') : '12:00'}
        </Typography>
      </Box>

      {/* 2. ROUTE */}
      <Box sx={{ width: 220, zIndex: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            fontSize: '1.8rem',
            color: isSelected ? '#fff' : primaryColor,
            width: 80,
            textAlign: 'left',
            letterSpacing: 2
          }}
        >
          {mission.origin}
        </Typography>
        <Typography sx={{ color: mutedColor, fontSize: '1.2rem' }}>→</Typography>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            fontSize: '1.8rem',
            color: isSelected ? '#fff' : primaryColor,
            width: 80,
            textAlign: 'left',
            letterSpacing: 2
          }}
        >
          {mission.destination}
        </Typography>
      </Box>

      {/* 3. TYPE (BADGE) */}
      <Box sx={{ width: 120, zIndex: 2, pl: 1 }}>
        <Chip
          label={mission.type || 'CARGO'}
          size='small'
          sx={{
            fontFamily: 'inherit',
            fontSize: '1rem',
            bgcolor: alpha(primaryColor, 0.15),
            color: isSelected ? '#fff' : primaryColor,
            border: `1px solid ${alpha(primaryColor, 0.4)}`,
            borderRadius: 1,
            height: 22,
            fontWeight: 'bold',
            '& .MuiChip-label': { px: 1 }
          }}
        />
      </Box>

      {/* 4. DISTANCE */}
      <Box sx={{ width: 100, textAlign: 'right', zIndex: 2 }}>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            fontSize: '1.6rem',
            color: isSelected ? '#fff' : primaryColor
          }}
        >
          {mission.distance.toString().padStart(4, '0')} NM
        </Typography>
      </Box>

      {/* 5. PRIZE */}
      <Box sx={{ width: 140, textAlign: 'right', ml: 3, zIndex: 2 }}>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            fontSize: '1.8rem',
            color: isSelected ? '#fff' : primaryColor,
            letterSpacing: 1
          }}
        >
          {formatNumber(mission.prize, 2)} AIRL
        </Typography>
      </Box>

      {/* 6. SPONSORED / STATUS */}
      <Box sx={{ width: 140, textAlign: 'right', ml: 2, zIndex: 2 }}>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            fontSize: '1.4rem',
            color:
              mission.rewardMultiplier >= 1.9
                ? theme.palette.success.main
                : mission.rewardMultiplier > 0.8
                  ? theme.palette.info.main
                  : alpha(theme.palette.text.disabled, 0.4),
            fontWeight: 'bold',
            letterSpacing: 1,
            textShadow:
              mission.rewardMultiplier > 0.8
                ? `0 0 10px ${mission.rewardMultiplier >= 1.9 ? theme.palette.success.main : theme.palette.info.main}`
                : 'none'
          }}
        >
          {mission.rewardMultiplier >= 1.9 ? 'TOP FLIGHT' : mission.rewardMultiplier > 0.8 ? 'BOOSTED' : 'SOLO'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: -0.5 }}>
          {mission.originAtcOnStart && (
            <Typography sx={{ fontSize: '0.7rem', color: theme.palette.info.main, opacity: 0.8 }}>
              ATC ORIGIN
            </Typography>
          )}
          {mission.isSponsored && (
            <Typography sx={{ fontSize: '0.7rem', color: theme.palette.success.main, opacity: 0.8 }}>
              ATC DEST
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default MissionRow
