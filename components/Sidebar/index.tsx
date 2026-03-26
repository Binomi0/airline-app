import React, { useCallback } from 'react'
import ConstructionIcon from '@mui/icons-material/Construction'
import HomeIcon from '@mui/icons-material/Home'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork'
import LocalAirportIcon from '@mui/icons-material/LocalAirport'
import ComputerIcon from '@mui/icons-material/Computer'
import SchoolIcon from '@mui/icons-material/School'
import { useMainProviderContext } from 'context/MainProvider'
import SidebarItem from './SidebarItem'
import { useRouter } from 'next/router'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Image from 'next/image'
import { Stack } from '@mui/material'

import EventIcon from '@mui/icons-material/Event'

const Sidebar: React.FC = () => {
  const router = useRouter()
  const { sidebarOpen: open, toggleSidebar } = useMainProviderContext()
  const { live } = useLiveFlightProviderContext()

  const handleClick = useCallback(
    (route: string) => () => {
      router.push(route)
      toggleSidebar('left')
    },
    [router, toggleSidebar]
  )

  // const handleToggleTheme = useCallback(() => {
  //   setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  // }, [setTheme])

  return (
    <Drawer open={open} onClose={() => toggleSidebar('left')}>
      <Stack direction='row' p={2} spacing={1}>
        <Image src='/logo64x64-white.png' alt='logo' width={32} height={32} />
        <Typography variant='h5'>WeiFly</Typography>
      </Stack>
      <Divider />
      <List>
        <SidebarItem onLink={handleClick('/')} text='Inicio' Icon={HomeIcon} selected={router.pathname === '/'} />
        <SidebarItem
          onLink={handleClick('/events')}
          text='Eventos'
          Icon={EventIcon}
          selected={router.pathname === '/events'}
        />
        <SidebarItem
          onLink={handleClick('/missions')}
          text='Misiones'
          Icon={AddHomeWorkIcon}
          selected={router.pathname === '/missions'}
        />
        <SidebarItem
          onLink={handleClick('/hangar')}
          text='Hangar'
          Icon={ConstructionIcon}
          selected={router.pathname === '/hangar'}
        />
        <SidebarItem
          onLink={handleClick('/license')}
          text='Licencias'
          Icon={WorkspacePremiumIcon}
          selected={router.pathname === '/license'}
        />
        <SidebarItem
          onLink={handleClick('/gas')}
          text='Gasolinera'
          Icon={LocalGasStationIcon}
          selected={router.pathname === '/gas'}
        />
        {live && (
          <SidebarItem
            onLink={handleClick('/live')}
            text='MISIÓN ACTUAL'
            Icon={LocalAirportIcon}
            selected={router.pathname === '/live'}
          />
        )}
      </List>

      <Divider />

      <List>
        <SidebarItem
          onLink={handleClick('/download')}
          text='Descargar App'
          Icon={ComputerIcon}
          selected={router.pathname === '/download'}
        />
        <SidebarItem
          onLink={handleClick('/guide')}
          text='Guía de Usuario'
          Icon={SchoolIcon}
          selected={router.pathname === '/guide'}
        />
      </List>
    </Drawer>
  )
}

export default Sidebar
