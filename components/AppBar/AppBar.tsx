import React, { useCallback, useEffect, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import Alert from '@mui/material/Alert'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Stack from '@mui/material/Stack'
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
import { useTokenProviderContext } from 'context/TokenProvider'
import styles from './appbar.module.css'
import { AlertTitle, Box, Button, Container, LinearProgress } from '@mui/material'

const copyToClipboard = (msg: string) => {
  navigator.clipboard.writeText(msg)
}

const maskAddress = (address?: string) => (address ? `${address.slice(0, 5)}...${address.slice(-4)}` : '')

const initialSnackState: AppBarSnack = { open: false, message: '', status: 'success' }

interface Props {
  loading: boolean
}
const CustomAppBar = ({ loading }: Props) => {
  const matches = useMediaQuery('(min-width:768px)')
  const { toggleSidebar } = useMainProviderContext()
  const { getBalances } = useTokenProviderContext()
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

  useEffect(() => {
    getBalances()
  }, [getBalances])

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
        <Toolbar sx={{ m: 0, p: 0 }}>
          <IconButton
            onClick={() => toggleSidebar('left')}
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 1 }}
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
          {matches && smartAccountAddress && (
            <Stack
              direction='row'
              onClick={() => copyToClipboard(smartAccountAddress)}
              spacing={1}
              className={styles.card}
              maxWidth={150}
              px={2}
              mr={2}
            >
              <Image width={17} height={17} src='/logos/metis.png' alt='Metis logo' />
              <Image width={10} height={17} src='/logos/eth-diamond-purple.png' alt='Ethereum logo' />
              <Typography fontWeight={700} fontFamily='Sora' variant='caption'>
                {maskAddress(smartAccountAddress)}
              </Typography>
            </Stack>
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
      <Box height={1}>{loading && <LinearProgress />}</Box>
      {user && !user?.vaUser && (
        <Container>
          <Alert
            severity='warning'
            action={
              <Button variant='outlined' color='warning'>
                Connect IVAO
              </Button>
            }
          >
            <AlertTitle>Connect your IVAO account</AlertTitle>
          </Alert>
        </Container>
      )}
    </>
  )
}

export default CustomAppBar
