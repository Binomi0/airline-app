import React from 'react'
import { Grid, Box, Typography, Skeleton } from '@mui/material'
import { Mission } from 'types'
import MissionCard from './MissionCard'

interface MissionBoardProps {
  missions: Mission[]
  onSelect: (mission: Mission) => void
  selectedMission?: Mission
  isLoading?: boolean
}

const MissionBoard: React.FC<MissionBoardProps> = ({ missions, onSelect, selectedMission, isLoading }) => {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (missions.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h5" color="text.secondary">
          No hay misiones disponibles cerca de tu posición.
        </Typography>
        <Typography color="text.secondary">
          Conecta con una torre ATC activa para desbloquear más misiones.
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3} sx={{ pb: 4 }}>
      {missions.map((mission, index) => (
        <Grid item xs={12} sm={6} md={4} key={`${mission.destination}-${index}`}>
          <MissionCard 
            mission={mission} 
            onSelect={onSelect} 
            isSelected={selectedMission?.destination === mission.destination && selectedMission?.origin === mission.origin}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default MissionBoard
