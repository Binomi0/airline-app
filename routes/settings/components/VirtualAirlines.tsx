import Box from '@mui/material/Box'
import { alpha } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
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

interface Props {
  user?: User
}

const VirtualAirlines = ({ user }: Props) => {
  const ivaoConnected = !!user?.vaUser?.pilotId

  return (
    <Paper variant='glass' sx={{ p: 4 }}>
      <Stack spacing={3}>
        <Typography variant='h6' sx={{ color: 'text.primary', fontWeight: 700 }}>
          Integrations
        </Typography>

        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Stack spacing={1}>
            <Stack direction='row' spacing={1} alignItems='center'>
              <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>IVAO Network</Typography>
              <Tooltip title='Connect your IVAO account to sync your flight history and ratings.'>
                <Info fontSize='small' sx={{ color: 'text.secondary', opacity: 0.4 }} />
              </Tooltip>
            </Stack>
            <Box>
              {ivaoConnected ? (
                <Stack alignItems='center' direction='row' spacing={1}>
                  <Check fontSize='small' sx={{ color: 'success.main' }} />
                  <Typography variant='caption' sx={{ color: 'success.main' }}>
                    Connected as {user?.vaUser?.pilotId}
                  </Typography>
                </Stack>
              ) : (
                <Stack alignItems='center' direction='row' spacing={1}>
                  <LinkOffIcon sx={{ color: 'warning.main' }} />
                  <Typography variant='caption' sx={{ color: 'warning.main' }}>
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
                borderColor: 'warning.main',
                color: 'warning.main',
                '&:hover': {
                  borderColor: 'text.primary',
                  background: (theme) => alpha(theme.palette.warning.main, 0.05)
                }
              }}
              onClick={() => {}}
            >
              Link IVAO
            </Button>
          )}
        </Stack>

        <Divider sx={{ borderColor: 'divider', opacity: 0.1 }} />

        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Stack spacing={1}>
            <Stack direction='row' spacing={1} alignItems='center'>
              <Typography sx={{ color: 'text.secondary', opacity: 0.4, fontWeight: 500 }}>VATSIM Network</Typography>
              <Tooltip title='VATSIM integration coming soon.'>
                <Info fontSize='small' sx={{ color: 'text.secondary', opacity: 0.2 }} />
              </Tooltip>
            </Stack>
          </Stack>
          <Button
            disabled
            variant='outlined'
            sx={{
              borderColor: 'divider',
              color: 'text.disabled',
              '&.Mui-disabled': { borderColor: 'divider', opacity: 0.2, color: 'text.disabled' }
            }}
          >
            Soon
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default VirtualAirlines
