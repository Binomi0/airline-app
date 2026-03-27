import React, { useCallback } from 'react'
import { Box, Button, Divider, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import BackupIcon from '@mui/icons-material/Backup'
import { walletStore } from 'store/wallet.atom'
import { downloadFile } from 'utils'
import { missingExportKeySwal, walletExportSwal, unlockWalletSwal } from 'lib/swal'
import { useRecoilState } from 'recoil'
import useWallet from 'hooks/useWallet'
import { decryptVault, deriveKeyFromPRF } from 'utils/crypto'
import { Check, Close, Info } from '@mui/icons-material'
import { User } from 'types'
import { getApi } from 'lib/api'
import { IWallet } from 'models/Wallet'
import useAccountSigner from 'hooks/useAccountSigner'

interface Props {
  user: User
}

const WalletSettings = ({ user }: Props) => {
  const [wallet, setWallet] = useRecoilState(walletStore)
  const { getPrivateKey, syncWallet } = useWallet()
  const { verifyCredential } = useAccountSigner()

  const handleDownloadKey = useCallback(async () => {
    if (!user?.id || !user?.email) return

    try {
      const { isConfirmed } = await unlockWalletSwal()
      if (!isConfirmed) return
      console.log('confirmado')
      const { verified } = await verifyCredential(user.email)
      if (!verified) return

      console.log('verificado')
      const wallet = await getApi<IWallet>('/api/wallet')
      const isCloudSynced = !!wallet?.encryptedVault
      if (!isCloudSynced) return

      console.log('sincronizado')
      const vaultData = JSON.stringify({ ciphertext: wallet.encryptedVault, iv: wallet.iv, protected: true })

      localStorage.setItem(user.id, Buffer.from(vaultData).toString('base64'))
      setWallet((prev) => ({ ...prev, isCloudSynced, isLoaded: true, isLocked: true }))

      console.log('guardado')
    } catch (error) {
      console.error('Sync wallet error:', error)
    }
  }, [user?.id, user?.email, setWallet, verifyCredential])

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
    if (!user?.id || !user?.email) return

    try {
      const storedValue = localStorage.getItem(user.id)
      if (!storedValue) {
        await missingExportKeySwal()
        return
      }

      const raw = Buffer.from(storedValue, 'base64').toString()
      let privateKey = ''

      try {
        const vault = JSON.parse(raw)
        if (vault.protected) {
          const { isConfirmed } = await unlockWalletSwal()
          if (!isConfirmed) return

          const { verified, prfSecret } = await verifyCredential(user.email)
          if (!verified) return

          const cryptoKey = await deriveKeyFromPRF(prfSecret!)
          privateKey = await decryptVault(vault.ciphertext, cryptoKey, vault.iv)
        } else {
          privateKey = raw.slice(0, 66)
        }
      } catch (error) {
        console.error('Export error:', error)
        privateKey = ''
        return
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
  }, [user?.id, user?.email, wallet.smartAccountAddress, verifyCredential])

  return (
    <Paper variant='glass' sx={{ height: '100%', p: 4 }}>
      <Stack spacing={3}>
        <Typography variant='h6' sx={{ color: 'text.primary', fontWeight: 700 }}>
          Wallet Security
        </Typography>

        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Stack spacing={1}>
            <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>Passkey Protection</Typography>
            <Box>
              <Tooltip title={wallet.isLoaded ? 'Active' : 'Not Loaded'}>
                <Stack alignItems='center' direction='row' spacing={1}>
                  {wallet.isLoaded ? (
                    <Check fontSize='small' sx={{ color: 'success.main' }} />
                  ) : (
                    <Close sx={{ color: 'error.main' }} />
                  )}
                  <Typography variant='caption' sx={{ color: wallet.isLoaded ? 'success.main' : 'error.main' }}>
                    {wallet.isLoaded ? 'Private key encrypted with Passkey' : 'Security not active'}
                  </Typography>
                </Stack>
              </Tooltip>
            </Box>
          </Stack>
          <Button
            size='small'
            variant='outlined'
            sx={{
              borderColor: (theme) => alpha(theme.palette.error.main, 0.4),
              color: 'error.main',
              '&:hover': { borderColor: 'error.main', background: (theme) => alpha(theme.palette.error.main, 0.05) }
            }}
            onClick={handleExportKey}
          >
            Export Key
          </Button>
        </Stack>

        <Divider sx={{ borderColor: 'divider', opacity: 0.1 }} />

        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Stack spacing={1}>
            <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>Cloud Sync</Typography>
            <Tooltip title={wallet.isCloudSynced ? 'Backup Active' : 'Backup Missing'}>
              <Stack alignItems='center' direction='row' spacing={1}>
                {wallet.isCloudSynced ? (
                  <Check fontSize='small' sx={{ color: 'success.main' }} />
                ) : (
                  <Info fontSize='small' sx={{ color: 'warning.main' }} />
                )}
                <Typography variant='caption' sx={{ color: wallet.isCloudSynced ? 'success.main' : 'warning.main' }}>
                  {wallet.isCloudSynced ? 'Encrypted backup active' : 'Backup missing in cloud'}
                </Typography>
              </Stack>
            </Tooltip>
            <Typography fontSize='0.75rem' sx={{ color: 'text.secondary', opacity: 0.4, maxWidth: '280px' }}>
              Allows wallet restoration if you lose access to this device.
            </Typography>
          </Stack>
          {!wallet.isCloudSynced && (
            <Button
              size='small'
              variant='outlined'
              sx={{
                borderColor: 'warning.main',
                color: 'warning.main',
                '&:hover': {
                  borderColor: 'text.primary',
                  background: (theme) => alpha(theme.palette.warning.main, 0.05)
                }
              }}
              onClick={handleUploadKey}
            >
              <Stack spacing={1} direction='row' alignItems='center'>
                <BackupIcon sx={{ fontSize: '1rem' }} />
                <Typography variant='button'>Sync</Typography>
              </Stack>
            </Button>
          )}
          {wallet.isCloudSynced && (
            <Button
              size='small'
              variant='outlined'
              sx={{
                borderColor: 'warning.main',
                color: 'warning.main',
                '&:hover': {
                  borderColor: 'text.primary',
                  background: (theme) => alpha(theme.palette.warning.main, 0.05)
                }
              }}
              onClick={handleDownloadKey}
            >
              <Stack spacing={1} direction='row' alignItems='center'>
                <BackupIcon sx={{ fontSize: '1rem' }} />
                <Typography variant='button'>Sync</Typography>
              </Stack>
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}

export default WalletSettings
