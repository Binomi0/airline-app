import React from 'react'
import { Box, Typography, Skeleton, Stack, alpha, useTheme } from '@mui/material'
import { Mission } from 'types'
import MissionRow from './MissionRow'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'

interface MissionBoardProps {
  // eslint-disable-next-line no-unused-vars
  missions: Mission[]
  onSelect: (mission: Mission) => void
  selectedMission?: Mission
  isLoading?: boolean
  filterSlot?: React.ReactNode
}

const MissionBoard: React.FC<MissionBoardProps> = ({ missions, onSelect, selectedMission, isLoading, filterSlot }) => {
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main

  if (isLoading) {
    return (
      <Stack spacing={0.5}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} variant='rectangular' height={40} sx={{ borderRadius: 0, bgcolor: '#050505' }} />
        ))}
      </Stack>
    )
  }

  return (
    <Box 
      sx={{ 
        pb: 4, 
        bgcolor: '#000', 
        p: 2, 
        borderRadius: '12px', 
        border: `1px solid ${alpha(primaryColor, 0.2)}`,
        boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.5)`
      }}
    >
      {/* Board Title & Filter Slot */}
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box 
            sx={{ 
              bgcolor: primaryColor, 
              p: 0.5, 
              borderRadius: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <FlightTakeoffIcon sx={{ color: '#000', fontSize: 24 }} />
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              color: primaryColor, 
              fontFamily: "'VT323', monospace", 
              fontWeight: 'bold',
              letterSpacing: 1
            }}
          >
            OPERATIONS CENTER
          </Typography>
        </Stack>

        {filterSlot && (
          <Box sx={{ minWidth: 200 }}>
            {filterSlot}
          </Box>
        )}
      </Stack>

      {missions.length === 0 ? (
        <Box textAlign='center' py={10} sx={{ border: '1px solid #1a1a1a' }}>
          <Typography variant='h5' sx={{ color: primaryColor, fontFamily: "'VT323', monospace" }}>
            NO MISSIONS AVAILABLE
          </Typography>
          <Typography sx={{ color: alpha(primaryColor, 0.6), fontFamily: "'VT323', monospace" }}>
            CONNECT TO AN ACTIVE ATC TOWER TO UNLOCK MISSIONS
          </Typography>
        </Box>
      ) : (
        <>
          {/* Flight Board Header Labels */}
          <Box 
            sx={{ 
              display: 'flex', 
              px: 2, 
              pb: 1, 
              mb: 1, 
              borderBottom: `1px solid #1a1a1a`,
              fontFamily: "'VT323', monospace",
              opacity: 0.8
            }}
          >
            <Typography sx={{ width: 80, color: primaryColor, fontSize: '1rem', fontWeight: 'bold' }}>TIME</Typography>
            <Typography sx={{ width: 220, color: primaryColor, fontSize: '1rem', fontWeight: 'bold' }}>ROUTE (ICAO)</Typography>
            <Typography sx={{ width: 120, color: primaryColor, fontSize: '1rem', fontWeight: 'bold', pl: 1 }}>TYPE</Typography>
            <Typography sx={{ width: 100, color: primaryColor, fontSize: '1rem', fontWeight: 'bold', textAlign: 'right' }}>DIST (NM)</Typography>
            <Typography sx={{ width: 140, color: primaryColor, fontSize: '1rem', fontWeight: 'bold', textAlign: 'right', ml: 3 }}>PRIZE (AIRL)</Typography>
            <Typography sx={{ width: 140, color: primaryColor, fontSize: '1rem', fontWeight: 'bold', textAlign: 'right', ml: 2 }}>STATUS</Typography>
          </Box>

          {/* Rows */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {missions.map((mission, index) => (
              <MissionRow
                key={`${mission.destination}-${index}`}
                mission={mission}
                onSelect={onSelect}
                isSelected={
                  selectedMission?.destination === mission.destination && selectedMission?.origin === mission.origin
                }
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}

export default MissionBoard
