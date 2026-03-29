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

  if (isLoading) {
    return (
      <Stack spacing={0.5}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} variant='rectangular' height={40} style={{ borderRadius: 0 }} />
        ))}
      </Stack>
    )
  }

  return (
    <Paper variant='terminal' style={{ zIndex: 1000 }}>
      {/* Board Title & Filter Slot */}
      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        justifyContent='space-between'
        style={{ marginBottom: 24 }}
      >
        <Stack direction='row' spacing={2} alignItems='center'>
          <Box
            style={{
              backgroundColor: theme.palette.primary.main,
              padding: '4px',
              borderRadius: theme.shape.borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FlightTakeoffIcon style={{ color: theme.palette.common.black, fontSize: 18 }} />
          </Box>
          <Typography
            variant='h6'
            color='primary'
            style={{ fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' }}
          >
            OPERATIONS CENTER
          </Typography>
        </Stack>

        {filterSlot && <Box style={{ minWidth: 200 }}>{filterSlot}</Box>}
      </Stack>

      {missions.length === 0 ? (
        <Box
          style={{
            textAlign: 'center',
            paddingTop: 80,
            paddingBottom: 80,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius
          }}
        >
          <Typography variant='h5' color='primary'>
            NO MISSIONS AVAILABLE
          </Typography>
          <Typography color='primary' style={{ opacity: 0.6 }}>
            CONNECT TO AN ACTIVE ATC TOWER TO UNLOCK MISSIONS
          </Typography>
        </Box>
      ) : (
        <>
          {/* Flight Board Header Labels */}
          <Box
            style={{
              display: 'flex',
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingBottom: '8px',
              marginBottom: '8px',
              borderBottom: `1px solid ${theme.palette.divider}`,
              opacity: 0.8
            }}
          >
            <HeaderLabel style={{ minWidth: 80 }}>DEPARTURE</HeaderLabel>
            <HeaderLabel style={{ minWidth: 100 }}>CALLSIGN</HeaderLabel>
            <HeaderLabel style={{ minWidth: 200 }}>ROUTE (ICAO)</HeaderLabel>
            <HeaderLabel style={{ minWidth: 100, paddingLeft: '8px' }}>TYPE</HeaderLabel>
            <HeaderLabel style={{ minWidth: 90, textAlign: 'right' }}>DIST (NM)</HeaderLabel>
            <HeaderLabel style={{ minWidth: 120, textAlign: 'right', marginLeft: '24px' }}>PRIZE (AIRL)</HeaderLabel>
            <HeaderLabel style={{ minWidth: 100, textAlign: 'right', marginLeft: '16px' }}>BONUS</HeaderLabel>
          </Box>

          {/* Rows */}
          <Stack direction='column'>
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
          </Stack>
        </>
      )}
    </Paper>
  )
}

const HeaderLabel = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <Typography
    variant='caption'
    color='primary'
    style={{
      width: '100%',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      ...style
    }}
  >
    {children}
  </Typography>
)

export default MissionBoard
