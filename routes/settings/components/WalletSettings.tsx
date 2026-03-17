import React, { useCallback } from 'react'
import { Box, Button, Divider, Paper, Stack, Tooltip, Typography } from '@mui/material'
import BackupIcon from '@mui/icons-material/Backup'
import { walletStore } from 'store/wallet.atom'
import { downloadFile } from 'utils'
import { missingExportKeySwal, walletExportSwal, unlockWalletSwal } from 'lib/swal'
import { useRecoilState } from 'recoil'
import useWallet from 'hooks/useWallet'
import { decryptVault, deriveKeyFromPRF } from 'utils/crypto'
import { Check, Close, Info } from '@mui/icons-material'

import { User } from 'types'

interface Props {
  user: User
}

const WalletSettings = ({ user }: Props) => {
  const [wallet] = useRecoilState(walletStore)
  const { getPRFSecret, getPrivateKey, syncWallet } = useWallet()

  const handleUploadKey = useCallback(async () => {
    if (!user?.id) return
    try {
      const privateKey = await getPrivateKey(user)
      await syncWallet(privateKey, user)
    } catch (error) {
      console.error('Upload error:', error)
    }
  }, [user, getPrivateKey, syncWallet])

  const handleExportKey = useCallback(async () => {
    if (!user?.id) return

    try {
      const storedValue = localStorage.getItem(user.id)
      if (!storedValue) {
        return missingExportKeySwal()
      }

      const raw = Buffer.from(storedValue, 'base64').toString()
      let privateKey = ''

      try {
        const vault = JSON.parse(raw)
        if (vault.protected) {
          const { isConfirmed } = await unlockWalletSwal()
          if (!isConfirmed) return
          const prfSecret = await getPRFSecret()
          const cryptoKey = await deriveKeyFromPRF(prfSecret)
          privateKey = await decryptVault(vault.ciphertext, cryptoKey, vault.iv)
        } else {
          privateKey = raw.slice(0, 66)
        }
      } catch {
        privateKey = raw.slice(0, 66)
      }

      const formattedKey = (privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`) as `0x${string}`
      if (wallet.smartAccountAddress) {
        const { isConfirmed } = await walletExportSwal(formattedKey)
        if (isConfirmed) {
          downloadFile(Buffer.from(privateKey).toString('base64'), wallet.smartAccountAddress)
        }
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }, [user?.id, wallet.smartAccountAddress, getPRFSecret])

  return (
    <Paper elevation={6}>
      <Box p={2}>
        <Stack spacing={2}>
          <Typography variant='h5' fontWeight='bold'>
            Wallet Security
          </Typography>

          <Divider />

          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Stack spacing={1}>
              <Typography variant='subtitle1' fontWeight='medium'>
                Passkey Protection
              </Typography>
              <Box>
                <Tooltip title={wallet.isLoaded ? 'Active' : 'Not Loaded'}>
                  <Stack alignItems='center' direction='row' spacing={1}>
                    {wallet.isLoaded ? <Check fontSize='small' color='success' /> : <Close color='error' />}
                    <Typography variant='caption' color={wallet.isLoaded ? 'success.main' : 'error.main'}>
                      Your private key is {wallet.isLoaded ? 'encrypted with your Passkey' : 'not secured'}.
                    </Typography>
                  </Stack>
                </Tooltip>
              </Box>
            </Stack>
            <Button size='small' variant='outlined' color='error' onClick={handleExportKey}>
              <Stack spacing={1} direction='row' alignItems='center'>
                <Typography>Export Private Key</Typography>
              </Stack>
            </Button>
          </Stack>

          <Divider />

          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Stack spacing={1}>
              <Typography variant='subtitle1' fontWeight='medium'>
                Cloud Wallet Backup
              </Typography>
              <Tooltip title={wallet.isCloudSynced ? 'Backup Active' : 'Backup Missing'}>
                <Stack alignItems='center' direction='row' spacing={1}>
                  {wallet.isCloudSynced ? (
                    <Check fontSize='small' color='success' />
                  ) : (
                    <Info fontSize='small' color='error' />
                  )}
                  <Typography variant='caption' color={wallet.isCloudSynced ? 'success.main' : 'error.main'}>
                    WeiFly{' '}
                    {wallet.isCloudSynced ? 'has a copy of your encrypted key' : 'does not have a backup of your key'}.
                  </Typography>
                </Stack>
              </Tooltip>
              <Typography fontSize='small' variant='body2' color='text.secondary'>
                In case you lose your device, you can restore your wallet using your Passkey.
              </Typography>
            </Stack>
            {!wallet.isCloudSynced && (
              <Stack spacing={2}>
                <Button size='small' variant='outlined' color='error' onClick={handleUploadKey}>
                  <Stack spacing={1} direction='row' alignItems='center'>
                    <BackupIcon className='h-4 w-4' />
                    <Typography>Upload to Cloud</Typography>
                  </Stack>
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>
    </Paper>
  )
}

export default WalletSettings
