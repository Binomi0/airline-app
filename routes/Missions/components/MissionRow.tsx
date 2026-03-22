import React from 'react'
import moment from 'moment'
import { Box, Typography, useTheme, alpha, Chip } from '@mui/material'
import { formatNumber } from 'utils'
import { PublicMission } from 'types'
import { b612Mono } from 'src/theme'

interface MissionRowProps {
  mission: PublicMission
  onSelect: (mission: PublicMission) => void
  isSelected?: boolean
}

const MissionRow: React.FC<MissionRowProps> = ({ mission, onSelect, isSelected }) => {
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main

  return (
    <Box
      onClick={() => onSelect(mission)}
      sx={{
        cursor: 'pointer',
        mb: '2px',
        background: isSelected ? alpha(primaryColor, 0.08) : 'rgba(0,0,0,0.8)',
        border: '1px solid',
        borderColor: isSelected ? alpha(primaryColor, 0.4) : 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 0.3,
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
        fontFamily: b612Mono.style.fontFamily,
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
      <Box sx={{ minWidth: 80, width: '100%', zIndex: 2 }}>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            color: isSelected ? '#fff' : primaryColor,
            lineHeight: 1,
            opacity: isSelected ? 1 : 0.8
          }}
        >
          {mission.startTime ? moment(mission.startTime).format('HH:mm') : '12:00'}
        </Typography>
      </Box>

      {/* 1.5 CALLSIGN */}
      <Box sx={{ minWidth: 100, width: '100%', zIndex: 2 }}>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            color: isSelected ? '#fff' : primaryColor,
            lineHeight: 1,
            fontWeight: 'bold',
            opacity: 0.9
          }}
        >
          {mission.callsign}
        </Typography>
      </Box>

      {/* 2. ROUTE */}
      <Box
        sx={{
          minWidth: 200,
          width: '100%',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            fontWeight: 'bold',
            color: isSelected ? '#fff' : 'primary.main',
            width: 70,
            textAlign: 'left',
            letterSpacing: 1
          }}
        >
          {mission.origin}
        </Typography>
        <Typography sx={{ color: alpha(primaryColor, 0.4), fontSize: '0.9rem' }}>→</Typography>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            fontWeight: 'bold',
            color: isSelected ? '#fff' : 'primary.main',
            width: 70,
            textAlign: 'left',
            letterSpacing: 1
          }}
        >
          {mission.destination}
        </Typography>
      </Box>

      {/* 3. TYPE (BADGE) */}
      <Box sx={{ minWidth: 100, width: '100%', zIndex: 2, pl: 1 }}>
        <Chip
          label={mission.type || 'CARGO'}
          size='small'
          sx={{
            fontFamily: 'inherit',
            bgcolor: alpha(primaryColor, 0.15),
            color: isSelected ? '#fff' : 'primary.main',
            border: '1px solid',
            borderColor: alpha(primaryColor, 0.4),
            borderRadius: 1,
            fontWeight: 'bold',
            '& .MuiChip-label': { px: 0.8 }
          }}
        />
      </Box>

      {/* 4. DISTANCE */}
      <Box sx={{ minWidth: 90, width: '100%', textAlign: 'right', zIndex: 2 }}>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            color: isSelected ? '#fff' : 'primary.main'
          }}
        >
          {mission.distance.toString().padStart(4, '0')} NM
        </Typography>
      </Box>

      {/* 5. PRIZE */}
      <Box sx={{ minWidth: 120, width: '100%', textAlign: 'right', ml: 3, zIndex: 2 }}>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            color: isSelected ? '#fff' : 'primary.main',
            letterSpacing: 0.5
          }}
        >
          {formatNumber(mission.prize, 2)} AIRL
        </Typography>
      </Box>

      {/* 6. SPONSORED / STATUS */}
      <Box sx={{ minWidth: 100, width: '100%', textAlign: 'right', ml: 2, zIndex: 2 }}>
        <Typography
          className='dot-text'
          sx={{
            fontFamily: 'inherit',
            color:
              mission.rewardMultiplier >= 1.9
                ? theme.palette.success.main
                : mission.rewardMultiplier > 0.8
                  ? theme.palette.info.main
                  : alpha(theme.palette.text.disabled, 0.4),
            fontWeight: 'bold',
            letterSpacing: 0.5,
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
            <Typography sx={{ fontSize: '0.7rem', color: 'info.main', opacity: 0.8 }}>ATC ORIGIN</Typography>
          )}
          {mission.isSponsored && (
            <Typography sx={{ fontSize: '0.7rem', color: 'success.main', opacity: 0.8 }}>ATC DEST</Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default MissionRow
