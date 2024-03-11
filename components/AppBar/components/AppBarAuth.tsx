import React from 'react'
import { Button, IconButton, Stack } from '@mui/material'
import { User } from 'types'
import { UserActionStatus } from '..'
import AirBalanceBar from './AirBalanceBar'
import GasBalanceBar from './GasBalanceBar'
import LicenseBar from './LicenseBar'
import SignIn from './SignIn'
import SignUp from './SignUp'
import SummarizeIcon from '@mui/icons-material/Summarize'

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
          <LicenseBar smartAccountAddress={smartAccountAddress} />
          <GasBalanceBar show={matches} smartAccountAddress={smartAccountAddress} />
          <AirBalanceBar show={matches} smartAccountAddress={smartAccountAddress} />
          <IconButton
            onClick={() => toggleSidebar('right')}
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <SummarizeIcon />
          </IconButton>
        </>
      )}
    </Stack>
  )
}

export default AppBarAuth
