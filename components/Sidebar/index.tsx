import React, { useCallback } from 'react'
import ConstructionIcon from '@mui/icons-material/Construction'
import HomeIcon from '@mui/icons-material/Home'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork'
import LocalAirportIcon from '@mui/icons-material/LocalAirport'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useMainProviderContext } from 'context/MainProvider'
import SidebarItem from './SidebarItem'
import { useRouter } from 'next/router'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Image from 'next/image'
import { Stack } from '@mui/material'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { userState } from 'store/user.atom'
import { themeStore } from 'store/theme.atom'
import { useTheme } from '@mui/material/styles'

const Sidebar: React.FC = () => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const { sidebarOpen: open, toggleSidebar } = useMainProviderContext()
  const { live } = useLiveFlightProviderContext()
  const muiTheme = useTheme()
  const setTheme = useSetRecoilState(themeStore)

  const handleClick = useCallback(
    (route: string) => () => {
      router.push(route)
      toggleSidebar('left')
    },
    [router, toggleSidebar]
  )

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  return (
    <Drawer open={open} onClose={() => toggleSidebar('left')}>
      <Stack direction='row' p={2} spacing={1}>
        <Image src='/logo64x64-white.png' alt='logo' width={32} height={32} />
        <Typography variant='h5'>WeiFly</Typography>
      </Stack>
      <Divider />
      <List>
        <SidebarItem onLink={handleClick('/')} text='Home' Icon={HomeIcon} selected={router.pathname === '/'} />
        <SidebarItem
          onLink={handleClick('/hangar')}
          text='Hangar'
          Icon={ConstructionIcon}
          selected={router.pathname === '/hangar'}
        />
        <SidebarItem
          onLink={handleClick('/license')}
          text='License'
          Icon={WorkspacePremiumIcon}
          selected={router.pathname === '/license'}
        />
        <SidebarItem
          onLink={handleClick('/gas')}
          text='Gas Station'
          Icon={LocalGasStationIcon}
          selected={router.pathname === '/gas'}
        />
        <SidebarItem
          onLink={handleClick('/cargo')}
          text='Main Cargo'
          Icon={AddHomeWorkIcon}
          selected={router.pathname === '/cargo'}
        />
        <SidebarItem
          disabled={!user?.vaUser}
          onLink={handleClick('/ivao')}
          text='IVAO'
          Icon={LocalAirportIcon}
          selected={router.pathname === '/ivao'}
        />
        {live && (
          <SidebarItem
            onLink={handleClick('/live')}
            text='LIVE FLIGHT'
            Icon={LocalAirportIcon}
            selected={router.pathname === '/live'}
          />
        )}
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleToggleTheme}>
            <ListItemIcon>
              {muiTheme.palette.mode === 'dark' ? <LightModeIcon color='warning' /> : <DarkModeIcon color='primary' />}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight={400}>
                  {muiTheme.palette.mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}

export default Sidebar
