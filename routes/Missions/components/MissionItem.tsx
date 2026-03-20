import React from 'react'
import { PublicMission } from 'types'
import styles from 'styles/Home.module.css'
import Grow from '@mui/material/Grow'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import moment from 'moment'

const MissionItem: React.FC<{
  mission: PublicMission
  delay: number
  // eslint-disable-next-line no-unused-vars
  onSelect: (missionId: string) => void
  style?: React.CSSProperties
}> = ({ mission, delay, onSelect, style }) => {
  const { origin, destination, distance, prize, basePrize, startTime, endTime, category, details } = mission
  const bonusPercent = basePrize > 0 ? Math.round(((prize - basePrize) / basePrize) * 100) : 0

  const startStr = moment(startTime).format('HH:mm')
  const endStr = moment(endTime).format('HH:mm')

  return (
    <div style={style}>
      <Grow in timeout={{ enter: delay }}>
        <Box p={1}>
          <Card
            className={styles.card}
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
          >
            <CardHeader
              title={
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <Typography variant='h5' color='white' fontWeight='bold'>
                    {origin} → {destination}
                  </Typography>
                  <Stack direction='row' spacing={1}>
                    {bonusPercent > 0 && (
                      <Chip
                        label={`+${bonusPercent}%`}
                        size='small'
                        sx={{
                          background: 'linear-gradient(45deg, #10b981 30%, #34d399 90%)',
                          color: 'black',
                          fontWeight: 'bold',
                          fontSize: '0.65rem'
                        }}
                      />
                    )}
                    <Chip
                      label={category}
                      size='small'
                      color={category === 'ATC' ? 'primary' : 'default'}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Stack>
                </Stack>
              }
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant='body2' color='grey.400' sx={{ mb: 2, minHeight: 40 }}>
                {details.description}
              </Typography>

              <Stack spacing={1.5}>
                <Stack direction='row' spacing={1} alignItems='center'>
                  <FlightTakeoffIcon sx={{ color: 'var(--home-accent)', fontSize: 20 }} />
                  <Typography variant='body2' color='white'>
                    Distancia: <strong>{distance} NM</strong>
                  </Typography>
                </Stack>

                <Stack direction='row' spacing={1} alignItems='center'>
                  <MonetizationOnIcon sx={{ color: '#ffd700', fontSize: 20 }} />
                  <Stack direction='column'>
                    <Typography variant='body2' color='white'>
                      Recompensa Total: <strong>{prize.toFixed(2)} AIRL</strong>
                    </Typography>
                    {bonusPercent > 0 && (
                      <Typography variant='caption' sx={{ color: '#10b981', fontWeight: 'medium' }}>
                        Incluye {bonusPercent}% de bonus
                      </Typography>
                    )}
                  </Stack>
                </Stack>

                <Stack direction='row' spacing={1} alignItems='center'>
                  <AccessTimeIcon sx={{ color: '#66bb6a', fontSize: 20 }} />
                  <Typography variant='body2' color='white'>
                    Ventana:{' '}
                    <strong>
                      {startStr} - {endStr}
                    </strong>
                  </Typography>
                </Stack>
              </Stack>

              <Box sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant='contained'
                  onClick={() => onSelect(mission._id!)}
                  sx={{
                    background: 'linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)',
                    fontWeight: 'bold',
                    textTransform: 'none'
                  }}
                >
                  Reservar Misión
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grow>
    </div>
  )
}

export default MissionItem
