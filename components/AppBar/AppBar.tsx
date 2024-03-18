import React, { useCallback, useEffect, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import Alert from '@mui/material/Alert'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Download from '@mui/icons-material/Download'
import useMediaQuery from '@mui/material/useMediaQuery'
import Snackbar from '@mui/material/Snackbar'
import { useMainProviderContext } from 'context/MainProvider'
import useAccountSigner from 'hooks/useAccountSigner'
import { AppBarSnack, UserActionStatus } from 'components/AppBar'
import AppBarAuth from './components/AppBarAuth'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { smartAccountAddressStore } from 'store/wallet.atom'

const copyToClipboard = (msg: string) => {
  navigator.clipboard.writeText(msg)
}

const maskAddress = (address?: string) => (address ? `${address.slice(0, 5)}...${address.slice(-4)}` : '')

const initialSnackState: AppBarSnack = { open: false, message: '', status: 'success' }

const CustomAppBar: React.FC = () => {
  const matches = useMediaQuery('(min-width:768px)')
  const { toggleSidebar } = useMainProviderContext()
  const trigger = useScrollTrigger()
  const { status } = useAccountSigner()
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const user = useRecoilValue(userState)
  const [userActionStarted, setUserActionStarted] = useState<UserActionStatus>()
  const [snack, setSnack] = useState<AppBarSnack>(initialSnackState)

  const handleDownloadApp = useCallback(() => {}, [])

  useEffect(() => {
    setSnack({ open: status === 'missingKey', message: 'Missing Key', status: 'error' })
    setSnack({ open: status === 'error', message: 'An error has occoured', status: 'error' })
    if (status === 'error') {
      setUserActionStarted(undefined)
    }
  }, [status])

  return (
    <>
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack(initialSnackState)}
      >
        <Alert onClose={() => setSnack(initialSnackState)} severity={snack.status} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
      <AppBar position='sticky' color={trigger ? 'primary' : 'transparent'}>
        <Toolbar>
          <IconButton
            onClick={() => toggleSidebar('left')}
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Image src='/logo64x64-white.png' alt='logo' width={32} height={32} />
          {matches ? (
            <Typography ml={2} variant='h6' component='div' sx={{ flexGrow: 1 }}>
              WeiFly (Alpha)
            </Typography>
          ) : (
            <Typography ml={2} variant='h6' component='div' sx={{ flexGrow: 1 }}>
              {' '}
            </Typography>
          )}
          {user && (
            <Tooltip title='Download App'>
              <IconButton color='inherit' onClick={handleDownloadApp}>
                <Download color='inherit' />
              </IconButton>
            </Tooltip>
          )}
          {smartAccountAddress && (
            <Box
              onClick={() => copyToClipboard(smartAccountAddress)}
              mr={2}
              bgcolor='secondary.main'
              borderRadius={5}
              px={2}
            >
              <Typography fontWeight={600} variant='caption'>
                {maskAddress(smartAccountAddress)}
              </Typography>
            </Box>
          )}
          <AppBarAuth
            toggleSidebar={toggleSidebar}
            matches={matches}
            setUserActionStarted={setUserActionStarted}
            userActionStarted={userActionStarted}
            user={user}
          />
        </Toolbar>
      </AppBar>
    </>
  )
}

export default CustomAppBar
