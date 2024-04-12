import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
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
    <Paper elevation={6}>
      <Box p={2}>
        <Typography variant='h5'>Virtual Airline</Typography>
      </Box>
      <Divider />
      <Box>
        <Stack direction='row' p={2} spacing={2} justifyContent='space-between' alignItems='center'>
          <Stack spacing={1} direction='row' alignItems='center'>
            <Box>
              <Stack direction='row' spacing={1} alignItems='center'>
                <Typography>IVAO</Typography>
                <Tooltip title=''>
                  <Info fontSize='small' />
                </Tooltip>
              </Stack>
              <Box>
                {ivaoConnected ? (
                  <Stack alignItems='center' direction='row' spacing={1}>
                    <Check color='success' />
                    <Typography variant='caption' color='success.light'>
                      Connected to ivao account: {user?.vaUser?.pilotId}
                    </Typography>
                  </Stack>
                ) : (
                  <Stack alignItems='center' direction='row' spacing={1}>
                    <LinkOffIcon color='warning' />
                    <Typography variant='caption' color='warning.light'>
                      Not connected to IVAO
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Box>
          </Stack>
          {ivaoConnected ? null : (
            <Button variant='outlined' color='warning' onClick={() => {}}>
              <Stack spacing={1} direction='row' alignItems='center'>
                <Typography>Connect to IVAO</Typography>
              </Stack>
            </Button>
          )}
        </Stack>
      </Box>
      <Divider />
      <Box>
        <Stack direction='row' p={2} spacing={2} justifyContent='space-between' alignItems='center'>
          <Stack spacing={1} direction='row' alignItems='center'>
            <Box>
              <Stack direction='row' spacing={1} alignItems='center'>
                <Typography>VATSIM</Typography>
                <Tooltip title=''>
                  <Info fontSize='small' />
                </Tooltip>
              </Stack>
            </Box>
          </Stack>
          <Button disabled variant='outlined' color='inherit' onClick={() => {}}>
            <Stack spacing={1} direction='row' alignItems='center'>
              <Typography>Connect to VATSIM</Typography>
            </Stack>
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default VirtualAirlines
