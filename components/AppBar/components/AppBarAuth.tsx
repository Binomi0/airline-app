import React from 'react'
import { IconButton, Stack } from '@mui/material'
import { User } from 'types'
import { UserActionStatus } from '..'
import AirBalanceBar from './AirBalanceBar'
import GasBalanceBar from './GasBalanceBar'
import LicenseBar from './LicenseBar'
import SignIn from './SignIn'
import SignUp from './SignUp'
import MenuIcon from '@mui/icons-material/Menu'

interface Props {
  user?: User
  userActionStarted: UserActionStatus
  setUserActionStarted: React.Dispatch<React.SetStateAction<UserActionStatus>>
  matches: boolean
  smartAccountAddress?: string
  // eslint-disable-next-line no-unused-vars
  toggleSidebar: (side: 'left' | 'right') => void
}

const AppBarAuth = ({
  smartAccountAddress,
  user,
  matches,
  userActionStarted,
  setUserActionStarted,
  toggleSidebar
}: Props) => {
  return (
    <Stack direction='row' alignItems='center' height={50} spacing={1}>
      {!user ? (
        <>
          {userActionStarted !== 'signUp' && <SignIn onInteraction={setUserActionStarted} />}
          {userActionStarted !== 'signIn' && <SignUp onInteraction={setUserActionStarted} />}
        </>
      ) : (
        <>
          <LicenseBar />
          <GasBalanceBar show={matches} smartAccountAddress={smartAccountAddress} />
          <AirBalanceBar show={matches} smartAccountAddress={smartAccountAddress} />
        </>
      )}
      <IconButton
        onClick={() => toggleSidebar('right')}
        size='large'
        edge='start'
        color='inherit'
        aria-label='menu'
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
    </Stack>
  )
}

export default AppBarAuth
