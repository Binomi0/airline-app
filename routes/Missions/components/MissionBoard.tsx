import React from 'react'
import { Box, Typography, Skeleton, Stack, useTheme, Paper } from '@mui/material'
import { PublicMission } from 'types'
import MissionRow from './MissionRow'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'

interface MissionBoardProps {
  missions: PublicMission[]
  onSelect: (mission: PublicMission) => void
  selectedMission?: PublicMission
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
          <Skeleton key={i} variant='rectangular' height={40} sx={{ borderRadius: 0 }} />
        ))}
      </Stack>
    )
  }

  return (
    <Paper
      variant='terminal'
      sx={{
        pb: 4,
        p: 2
      }}
    >
      {/* Board Title & Filter Slot */}
      <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mb: 3 }}>
        <Stack direction='row' spacing={2} alignItems='center'>
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
          <Typography variant='h4' color='primary' sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
            OPERATIONS CENTER
          </Typography>
        </Stack>

        {filterSlot && <Box sx={{ minWidth: 200 }}>{filterSlot}</Box>}
      </Stack>

      {missions.length === 0 ? (
        <Box textAlign='center' py={10} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant='h5' color='primary'>
            NO MISSIONS AVAILABLE
          </Typography>
          <Typography color='primary' sx={{ opacity: 0.6 }}>
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
              borderBottom: '1px solid',
              borderColor: 'divider',
              opacity: 0.8
            }}
          >
            <Typography sx={{ width: 80, color: 'primary.main', fontSize: '1rem', fontWeight: 'bold' }}>
              TIME
            </Typography>
            <Typography sx={{ width: 220, color: 'primary.main', fontSize: '1rem', fontWeight: 'bold' }}>
              ROUTE (ICAO)
            </Typography>
            <Typography sx={{ width: 120, color: 'primary.main', fontSize: '1rem', fontWeight: 'bold', pl: 1 }}>
              TYPE
            </Typography>
            <Typography
              sx={{ width: 100, color: 'primary.main', fontSize: '1rem', fontWeight: 'bold', textAlign: 'right' }}
            >
              DIST (NM)
            </Typography>
            <Typography
              sx={{
                width: 140,
                color: 'primary.main',
                fontSize: '1rem',
                fontWeight: 'bold',
                textAlign: 'right',
                ml: 3
              }}
            >
              PRIZE (AIRL)
            </Typography>
            <Typography
              sx={{
                width: 140,
                color: 'primary.main',
                fontSize: '1rem',
                fontWeight: 'bold',
                textAlign: 'right',
                ml: 2
              }}
            >
              STATUS
            </Typography>
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
    </Paper>
  )
}

export default MissionBoard
