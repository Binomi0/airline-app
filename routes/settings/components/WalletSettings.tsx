import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, Stack, Tooltip, Typography } from '@mui/material'
import BackupIcon from '@mui/icons-material/Backup'
import { walletStore } from 'store/wallet.atom'
import { downloadFile } from 'utils'
import { missingExportKeySwal, walletExportSwal, unlockWalletSwal } from 'lib/swal'
import { useRecoilState } from 'recoil'
import useWallet from 'hooks/useWallet'
import { decryptVault, deriveKeyFromPRF } from 'utils/crypto'
import { Check, Close, Info } from '@mui/icons-material'
import { User } from 'types'
import styles from 'styles/Settings.module.css'
import { getApi } from 'lib/api'
import { IWallet } from 'models/Wallet'
import useAccountSigner from 'hooks/useAccountSigner'

interface Props {
  user: User
}

const WalletSettings = ({ user }: Props) => {
  const [wallet, setWallet] = useRecoilState(walletStore)
  const [hasLocalKey, setHasLocalKey] = useState(false)
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
      setHasLocalKey(true)
      console.log('guardado')
    } catch (error) {
      console.error('Sync wallet error:', error)
    }
  }, [user])

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
  }, [user?.id, wallet.smartAccountAddress])

  useEffect(() => {
    if (user?.id) {
      const hasLocal = localStorage.getItem(user.id) || ''
      hasLocal && setHasLocalKey(true)
    }
  }, [user?.id])

  return (
    <Box className={styles.glassCard} sx={{ height: '100%' }}>
      <Stack spacing={3}>
        <Typography className={styles.sectionHeader}>Wallet Security</Typography>

        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Stack spacing={1}>
            <Typography sx={{ color: '#fff', fontWeight: 500 }}>Passkey Protection</Typography>
            <Box>
              <Tooltip title={wallet.isLoaded ? 'Active' : 'Not Loaded'}>
                <Stack alignItems='center' direction='row' spacing={1}>
                  {wallet.isLoaded ? (
                    <Check fontSize='small' sx={{ color: '#4ade80' }} />
                  ) : (
                    <Close sx={{ color: '#f87171' }} />
                  )}
                  <Typography variant='caption' sx={{ color: wallet.isLoaded ? '#4ade80' : '#f87171' }}>
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
              borderColor: 'rgba(248, 113, 113, 0.4)',
              color: '#f87171',
              '&:hover': { borderColor: '#f87171', background: 'rgba(248, 113, 113, 0.05)' }
            }}
            onClick={handleExportKey}
          >
            Export Key
          </Button>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Stack spacing={1}>
            <Typography sx={{ color: '#fff', fontWeight: 500 }}>Cloud Sync</Typography>
            <Tooltip title={wallet.isCloudSynced ? 'Backup Active' : 'Backup Missing'}>
              <Stack alignItems='center' direction='row' spacing={1}>
                {wallet.isCloudSynced ? (
                  <Check fontSize='small' sx={{ color: '#4ade80' }} />
                ) : (
                  <Info fontSize='small' sx={{ color: '#fbbf24' }} />
                )}
                <Typography variant='caption' sx={{ color: wallet.isCloudSynced ? '#4ade80' : '#fbbf24' }}>
                  {wallet.isCloudSynced ? 'Encrypted backup active' : 'Backup missing in cloud'}
                </Typography>
              </Stack>
            </Tooltip>
            <Typography fontSize='0.75rem' sx={{ color: 'rgba(255, 255, 255, 0.4)', maxWidth: '280px' }}>
              Allows wallet restoration if you lose access to this device.
            </Typography>
          </Stack>
          {!wallet.isCloudSynced && (
            <Button
              size='small'
              variant='outlined'
              sx={{
                borderColor: '#fbbf24',
                color: '#fbbf24',
                '&:hover': { borderColor: '#fff', background: 'rgba(251, 191, 36, 0.05)' }
              }}
              onClick={handleUploadKey}
            >
              <Stack spacing={1} direction='row' alignItems='center'>
                <BackupIcon sx={{ fontSize: '1rem' }} />
                <Typography variant='button'>Sync</Typography>
              </Stack>
            </Button>
          )}
          {wallet.isCloudSynced && !hasLocalKey && (
            <Button
              size='small'
              variant='outlined'
              sx={{
                borderColor: '#fbbf24',
                color: '#fbbf24',
                '&:hover': { borderColor: '#fff', background: 'rgba(251, 191, 36, 0.05)' }
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
    </Box>
  )
}

export default WalletSettings
