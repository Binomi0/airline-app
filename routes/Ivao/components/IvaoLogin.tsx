import { Box, Paper, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'
import IvaoStatus from './IvaoStatus'
import { User } from 'types'

interface Props {
  user: User
}

const IvaoLogin = ({ user }: Props) => {
  const ivaoUser = useRecoilValue(ivaoUserStore)

  return ivaoUser ? null : (
    <Stack height='calc(100vh - 64px)' justifyContent='center' alignItems='center'>
      <Paper>
        <Box p={2} textAlign='center'>
          <IvaoStatus user={user} ivaoUser={ivaoUser} />

          <Image priority width={222} height={73} src='https://static.ivao.aero/img/logos/logo.svg' alt='logo ivao' />
        </Box>
      </Paper>
    </Stack>
  )
}

export default IvaoLogin
