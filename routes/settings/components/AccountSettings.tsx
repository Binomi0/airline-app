import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Info from '@mui/icons-material/Info'
import Check from '@mui/icons-material/Check'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import useAccountSigner from 'hooks/useAccountSigner'
import { accountBackupSwal, removeBackupSwal } from 'lib/swal'
import moment from 'moment'

import styles from 'styles/Settings.module.css'

interface Props {
  hasBackup: boolean
}

const AccountSettings = ({ hasBackup }: Props) => {
  const { addBackup, backups, removeBackup } = useAccountSigner()

  const handleRemoveBackup = useCallback(
    async (credentialID: string) => {
      const confirm = await removeBackupSwal()
      if (confirm.isConfirmed) removeBackup(credentialID)
    },
    [removeBackup]
  )

  const handleAddBackup = useCallback(async () => {
    const confirm = await accountBackupSwal()
    if (confirm.isConfirmed) addBackup()
  }, [addBackup])

  return (
    <Box className={styles.glassCard} sx={{ height: '100%' }}>
      <Typography className={styles.sectionHeader}>Account Security</Typography>
      <Box>
        <Stack direction='row' spacing={2} justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
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
                background: 'rgba(255, 255, 255, 0.05)'
              }
            }}
            onClick={handleAddBackup}
          >
            Add Backup
          </Button>
        </Stack>

        {backups.length > 0 && (
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography
              variant='subtitle2'
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                mb: 2,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Registered Devices
            </Typography>
            <Stack spacing={2}>
              {backups.map((auth) => (
                <Stack
                  key={auth.credentialID}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <Stack direction='row' spacing={2} alignItems='center'>
                    <SmartphoneIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                    <Box>
                      <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>
                        {auth.name || 'Unknown Device'}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        Added {moment(auth.createdAt).fromNow()}
                      </Typography>
                    </Box>
                  </Stack>
                  {backups.length > 1 && (
                    <Tooltip title='Remove device'>
                      <IconButton
                        size='small'
                        onClick={() => handleRemoveBackup(auth.credentialID)}
                        sx={{ color: 'rgba(255, 255, 255, 0.4)', '&:hover': { color: '#f87171' } }}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AccountSettings
