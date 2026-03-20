import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import Check from '@mui/icons-material/Check'
import Info from '@mui/icons-material/Info'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import { User } from 'types'

import styles from 'styles/Settings.module.css'

interface Props {
  user?: User
}

const VirtualAirlines = ({ user }: Props) => {
  const ivaoConnected = !!user?.vaUser?.pilotId

  return (
    <Box className={styles.glassCard}>
      <Stack spacing={3}>
        <Typography className={styles.sectionHeader}>Integrations</Typography>

        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Stack spacing={1}>
            <Stack direction='row' spacing={1} alignItems='center'>
              <Typography sx={{ color: '#fff', fontWeight: 500 }}>IVAO Network</Typography>
              <Tooltip title='Connect your IVAO account to sync your flight history and ratings.'>
                <Info fontSize='small' sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
              </Tooltip>
            </Stack>
            <Box>
              {ivaoConnected ? (
                <Stack alignItems='center' direction='row' spacing={1}>
                  <Check fontSize='small' sx={{ color: '#4ade80' }} />
                  <Typography variant='caption' sx={{ color: '#4ade80' }}>
                    Connected as {user?.vaUser?.pilotId}
                  </Typography>
                </Stack>
              ) : (
                <Stack alignItems='center' direction='row' spacing={1}>
                  <LinkOffIcon sx={{ color: '#fbbf24' }} />
                  <Typography variant='caption' sx={{ color: '#fbbf24' }}>
                    Not linked
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>
          {!ivaoConnected && (
            <Button
              variant='outlined'
              sx={{
                borderColor: '#fbbf24',
                color: '#fbbf24',
                '&:hover': { borderColor: '#fff', background: 'rgba(251, 191, 36, 0.05)' }
              }}
              onClick={() => {}}
            >
              Link IVAO
            </Button>
          )}
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Stack spacing={1}>
            <Stack direction='row' spacing={1} alignItems='center'>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 500 }}>VATSIM Network</Typography>
              <Tooltip title='VATSIM integration coming soon.'>
                <Info fontSize='small' sx={{ color: 'rgba(255, 255, 255, 0.2)' }} />
              </Tooltip>
            </Stack>
          </Stack>
          <Button
            disabled
            variant='outlined'
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)',
              '&.Mui-disabled': { borderColor: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Soon
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default VirtualAirlines
