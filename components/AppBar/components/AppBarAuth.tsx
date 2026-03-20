import React from 'react'
import { User } from 'types'
import { UserActionStatus } from '..'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import WithAuth from './Auth/WithAuth'

interface Props {
  user?: User
  userActionStarted: UserActionStatus
  setUserActionStarted: React.Dispatch<React.SetStateAction<UserActionStatus>>
  // eslint-disable-next-line no-unused-vars
  toggleSidebar: (side: 'left' | 'right') => void
}

const AppBarAuth = ({ user, userActionStarted, setUserActionStarted, toggleSidebar }: Props) => {
  if (user) {
    return <WithAuth toggleSidebar={() => toggleSidebar('right')} />
  }
  return (
    <Stack direction='row' alignItems='center' height={50} spacing={1}>
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
    </Stack>
  )
}

export default AppBarAuth
