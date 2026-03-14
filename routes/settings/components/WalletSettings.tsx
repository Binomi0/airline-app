import React, { useCallback } from 'react'
import { Box, Paper, Stack, Tooltip, Typography } from '@mui/material'
import BackupIcon from '@mui/icons-material/Backup'
import { walletStore } from 'store/wallet.atom'
import { downloadFile } from 'utils'
import { missingExportKeySwal, walletExportSwal, unlockWalletSwal } from 'lib/swal'
import { useRecoilState } from 'recoil'
import useWallet from 'hooks/useWallet'
import { decryptVault, deriveKeyFromPRF } from 'utils/crypto'

interface Props {
  user: any
}

const WalletSettings = ({ user }: Props) => {
  const [wallet] = useRecoilState(walletStore)
  const { getPRFSecret } = useWallet() as any

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
          await unlockWalletSwal()
          const prfSecret = await getPRFSecret()
          const cryptoKey = await deriveKeyFromPRF(prfSecret)
          privateKey = await decryptVault(vault.ciphertext, cryptoKey, vault.iv)
        } else {
          privateKey = raw.slice(0, 66)
        }
      } catch (e) {
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
      <Box p={4}>
        <Stack spacing={4}>
          <Typography variant='h5' fontWeight='bold'>
            Wallet Security
          </Typography>

          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Stack spacing={1}>
              <Typography variant='subtitle1' fontWeight='medium'>
                Passkey Protection
              </Typography>
              <Tooltip title={wallet.isLoaded ? 'Active' : 'Not Loaded'}>
                <Typography variant='body2' color='text.secondary'>
                  Your private key is {wallet.isLoaded ? 'encrypted with your Passkey' : 'not secured'}.
                </Typography>
              </Tooltip>
            </Stack>

            <button
              onClick={handleExportKey}
              className='flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20'
            >
              <BackupIcon className='h-4 w-4' />
              Unlock & Export Private Key
            </button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  )
}

export default WalletSettings
