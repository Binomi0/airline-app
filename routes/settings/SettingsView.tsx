import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import React, { useCallback } from 'react'
import Check from '@mui/icons-material/Check'
import Info from '@mui/icons-material/Info'
import { walletStore } from 'store/wallet.atom'
import { downloadFile } from 'utils'
import { askExportKeySwal, missingExportKeySwal } from 'lib/swal'
import BackupIcon from '@mui/icons-material/Backup'
import { useRecoilState } from 'recoil'
import { User } from 'types'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import useAccountSigner from 'hooks/useAccountSigner'
import { accountBackupSwal } from 'lib/swal'

interface Props {
  hasBackup: boolean
  user: User
}

const SettingsView = ({ hasBackup, user }: Props) => {
  const [wallet] = useRecoilState(walletStore)
  const { addBackup } = useAccountSigner()

  const handleAddBackup = useCallback(async () => {
    const confirm = await accountBackupSwal()
    if (confirm.isConfirmed) addBackup()
  }, [addBackup])

  const handleExportKey = useCallback(async () => {
    if (!user?.id) throw new Error('Missing userId')

    const base64Key = localStorage.getItem(user.id)
    if (!base64Key) {
      if (wallet.baseSigner?.privateKey) {
        const { isConfirmed } = await askExportKeySwal(wallet.baseSigner.privateKey)
        if (isConfirmed) downloadFile(Buffer.from(wallet.baseSigner.privateKey).toString(), wallet.baseSigner.address)
      } else {
        return missingExportKeySwal()
      }
    } else {
      if (wallet.smartAccountAddress) {
        if (wallet.baseSigner?.privateKey) {
          const { isConfirmed } = await askExportKeySwal(wallet.baseSigner.privateKey)
          if (isConfirmed) downloadFile(base64Key, wallet.smartAccountAddress)
        }
      }
    }
  }, [user.id, wallet?.baseSigner?.address, wallet?.baseSigner?.privateKey, wallet.smartAccountAddress])

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={12}>
            <Box p={2}>
              <Typography variant='h5'>Security</Typography>
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
                            This account has already at least one backup device
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
                <Stack spacing={1} direction='row'>
                  <Button variant='outlined' color={hasBackup ? 'info' : 'warning'} onClick={handleAddBackup}>
                    Add Backup
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Divider />
            <Box>
              <Stack direction='row' p={2} spacing={2} justifyContent='space-between' alignItems='center'>
                <Stack spacing={1} direction='row' alignItems='center'>
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <Typography>Export Wallet</Typography>
                    <Tooltip
                      title={
                        <div>
                          This will allow you to download private key associated to your account here, at WeiFly,{' '}
                          <b>we do not have direct access to it without your consent</b>, so if you want to log in from
                          another device of computer, you will need this file, but keep is secret since{' '}
                          <b>is the only way to access your assets.</b>
                        </div>
                      }
                    >
                      <Info fontSize='small' />
                    </Tooltip>
                  </Stack>
                </Stack>
                <Button onClick={handleExportKey} variant='outlined'>
                  <Stack spacing={1} direction='row'>
                    <BackupIcon />
                    <Typography>Export Wallet</Typography>
                  </Stack>
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={12}>
            <Box p={2}>
              <Typography variant='h5'>SettingsView</Typography>
            </Box>
            <Divider />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SettingsView
