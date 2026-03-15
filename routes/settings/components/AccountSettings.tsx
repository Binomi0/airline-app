import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Info from '@mui/icons-material/Info'
import Check from '@mui/icons-material/Check'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import useAccountSigner from 'hooks/useAccountSigner'
import { accountBackupSwal } from 'lib/swal'

interface Props {
  hasBackup: boolean
}

const AccountSettings = ({ hasBackup }: Props) => {
  const { addBackup } = useAccountSigner()

  const handleAddBackup = useCallback(async () => {
    const confirm = await accountBackupSwal()
    if (confirm.isConfirmed) addBackup()
  }, [addBackup])

  return (
    <Paper elevation={6}>
      <Box p={2}>
        <Typography variant='h5'>Account (Login)</Typography>
      </Box>
      <Divider />
      <Box>
        <Stack direction='row' p={2} spacing={2} justifyContent='space-between' alignItems='center'>
          <Stack spacing={1} direction='row' alignItems='center'>
            <Box>
              <Stack direction='row' spacing={1} alignItems='center'>
                <Typography>Account Backup</Typography>
                <Info fontSize='small' />
              </Stack>
              <Box>
                {hasBackup ? (
                  <Stack alignItems='center' direction='row' spacing={1}>
                    <Check color='success' />
                    <Typography variant='caption' color='success.light'>
                      This account has at least one backup device
                    </Typography>
                  </Stack>
                ) : (
                  <Stack alignItems='center' direction='row' spacing={1}>
                    <CloudOffIcon color='warning' />
                    <Typography variant='caption' color='warning.light'>
                      This account does not have an account backup
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Box>
          </Stack>
          <Button variant='outlined' color={hasBackup ? 'info' : 'warning'} onClick={handleAddBackup}>
            <Stack spacing={1} direction='row' alignItems='center'>
              <Typography>Add Backup</Typography>
            </Stack>
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default AccountSettings
