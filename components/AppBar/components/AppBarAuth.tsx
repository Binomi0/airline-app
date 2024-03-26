import React from 'react'
import { User } from 'types'
import { UserActionStatus } from '..'
import AirBalanceBar from './AirBalanceBar'
import GasBalanceBar from './GasBalanceBar'
import LicenseBar from './LicenseBar'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useTheme } from '@mui/material'
import { useSetRecoilState } from 'recoil'
import { themeStore } from 'store/theme.atom'

interface Props {
  user?: User
  userActionStarted: UserActionStatus
  setUserActionStarted: React.Dispatch<React.SetStateAction<UserActionStatus>>
  matches: boolean
  // eslint-disable-next-line no-unused-vars
  toggleSidebar: (side: 'left' | 'right') => void
}

const AppBarAuth = ({ user, matches, userActionStarted, setUserActionStarted, toggleSidebar }: Props) => {
  const theme = useTheme()
  const setTheme = useSetRecoilState(themeStore)

  const handleToogleTheme = () => {
    setTheme((state) => (state === 'dark' ? 'light' : 'dark'))
  }

  return (
    <Stack direction='row' alignItems='center' height={50} spacing={1}>
      {!user && (
        <>
          {!userActionStarted && (
            <>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => {
                  setUserActionStarted('signIn')
                }}
              >
                Connect
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  setUserActionStarted('signUp')
                }}
              >
                Create Account
              </Button>
            </>
          )}
          {userActionStarted === 'signIn' && <SignIn onInteraction={setUserActionStarted} />}
          {['signUp', 'code'].some((status) => status === userActionStarted) && (
            <SignUp onInteraction={setUserActionStarted} />
          )}
        </>
      )}
      {user && (
        <>
          <LicenseBar />
          <GasBalanceBar show={matches} />
          <AirBalanceBar show={matches} />
          <IconButton onClick={handleToogleTheme}>
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton
            onClick={() => toggleSidebar('right')}
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MoreVertIcon />
          </IconButton>
        </>
      )}
    </Stack>
  )
}

export default AppBarAuth
