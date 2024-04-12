import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import BackupIcon from '@mui/icons-material/Backup'
import Info from '@mui/icons-material/Info'
import { walletStore } from 'store/wallet.atom'
import { downloadFile } from 'utils'
import { askExportKeySwal, missingExportKeySwal } from 'lib/swal'
import { useRecoilState } from 'recoil'
import { User } from 'types'

interface Props {
  user?: User
}

const WalletSettings = ({ user }: Props) => {
  const [wallet] = useRecoilState(walletStore)

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
  }, [user?.id, wallet?.baseSigner?.address, wallet?.baseSigner?.privateKey, wallet.smartAccountAddress])

  return (
    <Paper elevation={6}>
      <Box p={2}>
        <Typography variant='h5'>Wallet</Typography>
      </Box>
      <Divider />

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
                    <b>we do not have any kind of access to it without your consent</b>, so if you want to log in from
                    another device or computer, you will need this file, make sure you keep it secret since{' '}
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
  )
}

export default WalletSettings
