import React, { useCallback } from 'react'
import AirlinesIcon from '@mui/icons-material/Airlines'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import { useMainProviderContext } from 'context/MainProvider'
import { useTheme } from '@mui/system'
import Backup from '@mui/icons-material/Backup'
import ExitToApp from '@mui/icons-material/ExitToApp'
import ImportExport from '@mui/icons-material/ImportExport'
import VerifiedUser from '@mui/icons-material/VerifiedUser'
import { accountBackupSwal, askExportKeySwal, missingExportKeySwal, signedOutSwal } from 'lib/swal'
import customProtocolCheck from 'custom-protocol-check'
import useAccountSigner from 'hooks/useAccountSigner'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { downloadFile } from 'utils'
import { useRouter } from 'next/router'
import Login from '@mui/icons-material/Login'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ListItemButton from '@mui/material/ListItemButton'
import Stack from '@mui/material/Stack'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { authStore } from 'store/auth.atom'

const RightSidebar: React.FC = () => {
  const user = useRecoilValue(userState)
  const token = useRecoilValue(authStore)
  const theme = useTheme()
  const router = useRouter()
  const { rightSidebarOpen: open, toggleSidebar } = useMainProviderContext()
  const { addBackup, handleSignOut } = useAccountSigner()
  const { smartAccountAddress, baseSigner } = useAlchemyProviderContext()

  const handleClick = useCallback(
    (route: string) => () => {
      toggleSidebar('right')
      router.push(route)
    },
    [router, toggleSidebar]
  )

  const handleAddBackup = useCallback(async () => {
    toggleSidebar('right')
    const confirm = await accountBackupSwal()
    if (confirm.isConfirmed) addBackup()
  }, [addBackup, toggleSidebar])

  const handleExportKey = useCallback(async () => {
    if (!user?.id) throw new Error('Missing userId')

    toggleSidebar('right')
    const base64Key = localStorage.getItem(user.id)
    if (!base64Key) {
      if (baseSigner?.privateKey) {
        const { isConfirmed } = await askExportKeySwal(baseSigner.privateKey)
        if (isConfirmed) downloadFile(Buffer.from(baseSigner.privateKey).toString(), baseSigner.address)
      } else {
        return missingExportKeySwal()
      }
    } else {
      if (smartAccountAddress) {
        if (baseSigner?.privateKey) {
          const { isConfirmed } = await askExportKeySwal(baseSigner.privateKey)
          if (isConfirmed) downloadFile(base64Key, smartAccountAddress)
        }
      }
    }
  }, [baseSigner?.address, baseSigner?.privateKey, smartAccountAddress, toggleSidebar, user?.id])

  const onSignOut = React.useCallback(async () => {
    toggleSidebar('right')
    const confirm = await signedOutSwal()
    if (confirm.isConfirmed) handleSignOut()
  }, [handleSignOut, toggleSidebar])

  const handleOpenApp = React.useCallback(() => {
    if (!token) {
      throw new Error('Missing token to open app')
    }
    // window.open(`weifly4://token=${token}`)
    customProtocolCheck(
      `weifly://token=${token}`,
      () => {
        console.debug('App is not installed in user system')
      },
      () => {
        console.debug('App ready to open in user system')
        window.open(`weifly://token=${token}`)
      },
      5000
    )
  }, [token])

  if (!user) {
    return null
  }

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={() => toggleSidebar('right')}
      PaperProps={{ sx: { backgroundColor: theme.palette.common.white } }}
    >
      <Box px={2} pb={1} color='black' minWidth={250}>
        <List>
          <ListItem color={theme.palette.common.white} onClick={() => toggleSidebar('right')}>
            <ListItemAvatar color={theme.palette.common.white}>
              <Avatar>
                <VerifiedUser color='secondary' />
              </Avatar>
            </ListItemAvatar>
            <Typography letterSpacing={-0.5} fontFamily='B612 Mono' fontWeight={600}>
              {user.email}
            </Typography>
          </ListItem>
          <Divider />
          <List>
            <ListItemButton onClick={handleOpenApp}>
              <Stack direction='row' spacing={5}>
                <Login color='success' />
                <Typography>Abrir App</Typography>
              </Stack>
            </ListItemButton>
          </List>
          <Divider />
          <Box my={10}>
            <ListItemButton onClick={handleAddBackup}>
              <Stack direction='row' spacing={5}>
                <Backup color='primary' />
                <Typography>Add Account Backup</Typography>
              </Stack>
            </ListItemButton>
            <ListItemButton onClick={handleExportKey}>
              <Stack direction='row' spacing={5}>
                <ImportExport color='primary' />
                <Typography>Export Wallet</Typography>
              </Stack>
            </ListItemButton>
            <ListItemButton onClick={handleClick('/flights')}>
              <Stack direction='row' spacing={5}>
                <AirplaneTicketIcon color='primary' />
                <Typography>My Flights</Typography>
              </Stack>
            </ListItemButton>
            <ListItemButton onClick={handleClick('/user/aircraft')}>
              <Stack direction='row' spacing={5}>
                <AirlinesIcon color='primary' />
                <Typography>My Aircrafts</Typography>
              </Stack>
            </ListItemButton>
            <ListItemButton onClick={onSignOut}>
              <Stack direction='row' spacing={5}>
                <ExitToApp color='error' />
                <Typography>Log Out</Typography>
              </Stack>
            </ListItemButton>
          </Box>
        </List>
      </Box>
    </Drawer>
  )
}

export default RightSidebar
