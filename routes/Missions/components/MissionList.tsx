import MissionRow from './MissionRow'
import React, { useCallback } from 'react'
import { PublicMission, Mission } from 'types'
import { getCallsign } from 'utils'
import Fade from '@mui/material/Fade'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { INft } from 'models/Nft'
import { Box, Stack, Typography, useTheme, alpha } from '@mui/material'

type Props = {
  reserveMission: (missionId: string, aircraft: INft, callsign: string) => Promise<Mission>
  pool: PublicMission[]
  aircraft?: INft
}

const MissionList = ({ reserveMission, pool, aircraft }: Props) => {
  const address = useRecoilValue(smartAccountAddressStore)
  const theme = useTheme()

  const handleSelect = useCallback(
    async (mission: PublicMission) => {
      if (!aircraft) {
        alert('Selecciona una aeronave primero')
        return
      }
      try {
        await reserveMission(mission._id!, aircraft, getCallsign())
      } catch {
        alert('No se pudo reservar la misión. Es posible que otro piloto la haya tomado.')
      }
    },
    [reserveMission, aircraft]
  )

  return (
    <Fade in={pool.length > 0 && !!address} unmountOnExit>
      <Box sx={{ pb: 4 }}>
        {/* Flight Board Header */}
        <Box
          sx={{
            display: 'flex',
            px: 1.5,
            pb: 1,
            mb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            opacity: 0.6
          }}
        >
          <Typography variant='caption' sx={{ width: 100, fontWeight: 'bold' }}>
            TIPO
          </Typography>
          <Typography variant='caption' sx={{ width: 150, fontWeight: 'bold' }}>
            RUTA (ICAO)
          </Typography>
          <Typography variant='caption' sx={{ flex: 1, fontWeight: 'bold' }}>
            DETALLES DE MISIÓN
          </Typography>
          <Typography variant='caption' sx={{ width: 80, fontWeight: 'bold', textAlign: 'right' }}>
            DIST (NM)
          </Typography>
          <Typography variant='caption' sx={{ width: 120, fontWeight: 'bold', textAlign: 'right', ml: 2 }}>
            PREMIO (AIRL)
          </Typography>
          <Box sx={{ width: 44 }} />
        </Box>

        <Stack spacing={1}>
          {pool.map((mission) => (
            <MissionRow key={mission._id} mission={mission} onSelect={handleSelect} />
          ))}
        </Stack>
      </Box>
    </Fade>
  )
}

export default MissionList
