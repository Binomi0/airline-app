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
      style={{
        cursor: 'pointer',
        marginBottom: '2px',
        background: isSelected ? alpha(primaryColor, 0.08) : alpha(theme.palette.background.paper, 0.8),
        border: '1px solid',
        borderColor: isSelected ? alpha(primaryColor, 0.4) : alpha(theme.palette.divider, 0.1),
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(0.3),
        paddingBottom: theme.spacing(0.3),
        position: 'relative',
        transition: 'all 0.1s ease',
        fontFamily: b612Mono.style.fontFamily,
        textTransform: 'uppercase'
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          backgroundColor: alpha(theme.palette.divider, 0.02),
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* 1. TIME */}
      <Box style={{ width: '100%', minWidth: 80, zIndex: 2 }}>
        <Typography
          className='dot-text'
          style={{
            fontFamily: 'inherit',
            color: isSelected ? theme.palette.common.white : primaryColor,
            lineHeight: 1,
            opacity: isSelected ? 1 : 0.8
          }}
        >
          {mission.startTime ? moment(mission.startTime).format('HH:mm') : '12:00'}
        </Typography>
      </Box>

      {/* 1.5 CALLSIGN */}
      <Box style={{ width: '100%', minWidth: 100, zIndex: 2 }}>
        <Typography
          className='dot-text'
          style={{
            fontFamily: 'inherit',
            color: isSelected ? theme.palette.common.white : primaryColor,
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
        style={{
          minWidth: 200,
          width: '100%',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing(2)
        }}
      >
        <Typography
          className='dot-text'
          style={{
            fontFamily: 'inherit',
            fontWeight: 'bold',
            color: isSelected ? theme.palette.common.white : primaryColor,
            width: 70,
            textAlign: 'left',
            letterSpacing: 1
          }}
        >
          {mission.origin}
        </Typography>
        <Typography style={{ color: alpha(primaryColor, 0.4), fontSize: '0.9rem' }}>→</Typography>
        <Typography
          className='dot-text'
          style={{
            fontFamily: 'inherit',
            fontWeight: 'bold',
            color: isSelected ? theme.palette.common.white : primaryColor,
            width: 70,
            textAlign: 'left',
            letterSpacing: 1
          }}
        >
          {mission.destination}
        </Typography>
      </Box>

      {/* 3. TYPE (BADGE) */}
      <Box style={{ minWidth: 100, width: '100%', zIndex: 2, paddingLeft: theme.spacing(1) }}>
        <Chip
          label={mission.type || 'CARGO'}
          size='small'
          style={{
            fontFamily: 'inherit',
            backgroundColor: alpha(primaryColor, 0.15),
            color: isSelected ? theme.palette.common.white : primaryColor,
            border: `1px solid ${alpha(primaryColor, 0.4)}`,
            borderRadius: theme.shape.borderRadius,
            fontWeight: 'bold'
          }}
        />
      </Box>

      {/* 4. DISTANCE */}
      <Box style={{ minWidth: 90, width: '100%', textAlign: 'right', zIndex: 2 }}>
        <Typography
          className='dot-text'
          style={{
            fontFamily: 'inherit',
            color: isSelected ? theme.palette.common.white : primaryColor
          }}
        >
          {mission.distance.toString().padStart(4, '0')} NM
        </Typography>
      </Box>

      {/* 5. PRIZE */}
      <Box style={{ minWidth: 120, width: '100%', textAlign: 'right', marginLeft: theme.spacing(3), zIndex: 2 }}>
        <Typography
          className='dot-text'
          style={{
            fontFamily: 'inherit',
            color: isSelected ? theme.palette.common.white : primaryColor,
            letterSpacing: 0.5
          }}
        >
          {formatNumber(mission.prize, 2)} AIRL
        </Typography>
      </Box>

      {/* 6. SPONSORED / STATUS */}
      <Box style={{ minWidth: 100, width: '100%', textAlign: 'right', marginLeft: theme.spacing(2), zIndex: 2 }}>
        <Typography
          className='dot-text'
          style={{
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
        <Box style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing(0.5), marginTop: -4 }}>
          {mission.originAtcOnStart && (
            <Typography variant='caption' style={{ fontSize: '0.7rem', color: theme.palette.info.main, opacity: 0.8 }}>
              ATC ORIGIN
            </Typography>
          )}
          {mission.isSponsored && (
            <Typography
              variant='caption'
              style={{ fontSize: '0.7rem', color: theme.palette.success.main, opacity: 0.8 }}
            >
              ATC DEST
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default MissionRow
