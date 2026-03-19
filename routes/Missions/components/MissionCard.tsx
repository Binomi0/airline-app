import React from 'react'
import { Card, CardContent, Typography, Box, Chip, Stack, Button, useTheme, alpha } from '@mui/material'
import { Mission, MissionCategory } from 'types'
import { formatNumber } from 'utils'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import StarsIcon from '@mui/icons-material/Stars'
import LocalAirportIcon from '@mui/icons-material/LocalAirport'

interface MissionCardProps {
  mission: Mission
  onSelect: (mission: Mission) => void
  isSelected?: boolean
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onSelect, isSelected }) => {
  const theme = useTheme()
  const isSponsored = mission.category === MissionCategory.ATC
  
  const borderColor = isSponsored 
    ? theme.palette.success.main 
    : theme.palette.divider

  const backgroundColor = isSelected 
    ? alpha(isSponsored ? theme.palette.success.main : theme.palette.primary.main, 0.1)
    : theme.palette.background.paper

  return (
    <Card 
      onClick={() => onSelect(mission)}
      sx={{ 
        cursor: 'pointer',
        border: `2px solid ${isSelected ? theme.palette.primary.main : borderColor}`,
        backgroundColor,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        },
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {isSponsored && (
        <Chip
          icon={<StarsIcon sx={{ color: 'white !important' }} />}
          label="SPONSORED (ATC)"
          color="success"
          size="small"
          sx={{ 
            position: 'absolute', 
            top: -12, 
            left: 16, 
            fontWeight: 'bold',
            boxShadow: theme.shadows[2]
          }}
        />
      )}
      {!isSponsored && mission.category === MissionCategory.SOLO && (
        <Chip
          icon={<LocalAirportIcon />}
          label="SOLO"
          variant="outlined"
          size="small"
          sx={{ 
            position: 'absolute', 
            top: -12, 
            left: 16, 
            backgroundColor: theme.palette.background.paper
          }}
        />
      )}

      <CardContent sx={{ pt: 3 }}>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="text.secondary">
              Distancia: {formatNumber(mission.distance, 0)} NM
            </Typography>
            <Typography variant="h6" color={isSponsored ? "success.main" : "primary.main"}>
              {formatNumber(mission.prize)} AIRL
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography variant="h5" fontWeight="bold">{mission.origin}</Typography>
            <Box sx={{ borderBottom: `2px dashed ${theme.palette.divider}`, flex: 1, mx: 1, position: 'relative' }}>
              <FlightTakeoffIcon sx={{ 
                position: 'absolute', 
                left: '50%', 
                top: -12, 
                transform: 'translateX(-50%)',
                color: theme.palette.text.disabled,
                fontSize: '1.2rem'
              }} />
            </Box>
            <Typography variant="h5" fontWeight="bold">{mission.destination}</Typography>
          </Stack>

          <Box>
            <Typography variant="body2" fontWeight="bold" noWrap>
              {mission.details?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.2,
              height: '2.4em'
            }}>
              {mission.details?.description}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default MissionCard
