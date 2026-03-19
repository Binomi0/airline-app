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

import styles from 'styles/Settings.module.css'

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
    <Box className={styles.glassCard} sx={{ height: '100%' }}>
      <Typography className={styles.sectionHeader}>Account Security</Typography>
      <Box>
        <Stack direction='row' spacing={2} justifyContent='space-between' alignItems='center'>
          <Stack spacing={1} direction='row' alignItems='center'>
            <Box>
              <Stack direction='row' spacing={1} alignItems='center'>
                <Typography sx={{ color: '#fff', fontWeight: 500 }}>Passkey Backup</Typography>
                <Info fontSize='small' sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
              </Stack>
              <Box sx={{ mt: 1 }}>
                {hasBackup ? (
                  <Stack alignItems='center' direction='row' spacing={1}>
                    <Check color='success' />
                    <Typography variant='caption' sx={{ color: '#4ade80' }}>
                      Secure: Multi-device backup enabled
                    </Typography>
                  </Stack>
                ) : (
                  <Stack alignItems='center' direction='row' spacing={1}>
                    <CloudOffIcon color='warning' />
                    <Typography variant='caption' sx={{ color: '#fbbf24' }}>
                      Action required: No backup devices registered
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Box>
          </Stack>
          <Button
            variant='outlined'
            sx={{
              borderColor: hasBackup ? 'rgba(255, 255, 255, 0.2)' : '#fbbf24',
              color: hasBackup ? '#fff' : '#fbbf24',
              '&:hover': {
                borderColor: '#fff',
                background: 'rgba(255, 255, 255, 0.05)',
              },
            }}
            onClick={handleAddBackup}
          >
            Add Backup
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default AccountSettings
