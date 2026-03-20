import React, { useCallback } from 'react'
import AirlinesIcon from '@mui/icons-material/Airlines'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import { useMainProviderContext } from 'context/MainProvider'
import ExitToApp from '@mui/icons-material/ExitToApp'
import VerifiedUser from '@mui/icons-material/VerifiedUser'
import { signedOutSwal } from 'lib/swal'
import customProtocolCheck from 'custom-protocol-check'
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
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { userState } from 'store/user.atom'
import useAuth from 'hooks/useAuth'
import { authStore } from 'store/auth.atom'
import { themeStore } from 'store/theme.atom'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useTheme } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

const RightSidebar: React.FC = () => {
  const user = useRecoilValue(userState)
  const token = useRecoilValue(authStore)
  const router = useRouter()
  const { rightSidebarOpen: open, toggleSidebar } = useMainProviderContext()
  const { handleSignOut } = useAuth()
  const theme = useTheme()
  const setTheme = useSetRecoilState(themeStore)

  const handleToogleTheme = useCallback(() => {
    setTheme((state) => (state === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  const handleClick = useCallback(
    (route: string) => () => {
      toggleSidebar('right')
      router.push(route)
    },
    [router, toggleSidebar]
  )

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
    <Drawer anchor='right' open={open} onClose={() => toggleSidebar('right')}>
      <Box>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <VerifiedUser />
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
          <List>
            <ListItemButton onClick={handleToogleTheme}>
              <Stack direction='row' spacing={5}>
                <LightModeIcon color={theme.palette.mode === 'dark' ? 'disabled' : 'info'} />
                <Typography>Dark Mode</Typography>
                <DarkModeIcon color={theme.palette.mode === 'light' ? 'disabled' : 'warning'} />
              </Stack>
            </ListItemButton>
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={handleClick('/settings')}>
              <Stack direction='row' spacing={5}>
                <SettingsIcon />
                <Typography>Settings</Typography>
              </Stack>
            </ListItemButton>
            <ListItemButton onClick={handleClick('/flights')}>
              <Stack direction='row' spacing={5}>
                <AirplaneTicketIcon />
                <Typography>My Flights</Typography>
              </Stack>
            </ListItemButton>
            <ListItemButton onClick={handleClick('/user/aircraft')}>
              <Stack direction='row' spacing={5}>
                <AirlinesIcon />
                <Typography>My Aircrafts</Typography>
              </Stack>
            </ListItemButton>
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={onSignOut}>
              <Stack direction='row' spacing={5}>
                <ExitToApp color='error' />
                <Typography>Log Out</Typography>
              </Stack>
            </ListItemButton>
          </List>
        </List>
      </Box>
    </Drawer>
  )
}

export default RightSidebar
