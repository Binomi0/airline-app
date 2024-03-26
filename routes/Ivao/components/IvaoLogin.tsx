import { Box, Paper, Stack, Typography, darken } from '@mui/material'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'
import IvaoConnection from './IvaoConnection'
import { User } from 'types'
import { pilotsStore } from 'store/pilots.atom'

interface Props {
  user: User
}

const IvaoLogin = ({ user }: Props) => {
  const ivaoUser = useRecoilValue(ivaoUserStore)
  const [color, setColor] = useState('#fff')
  const pilots = useRecoilValue(pilotsStore)

  const isFlying = useMemo(
    () => pilots.some((pilot) => pilot?.userId.toString() === user.vaUser?.pilotId),
    [pilots, user.vaUser?.pilotId]
  )

  useEffect(() => {
    setColor(isFlying ? '#00FF00' : '#FFF000')
  }, [isFlying])

  return ivaoUser ? (
    <Stack direction='row' spacing={2} alignItems='center' mt={2}>
      <div
        style={{
          width: 32,
          height: 32,
          border: `1px solid ${darken(color, 0.3)}`,
          borderRadius: '50%',
          background: `linear-gradient(270deg, ${darken(color, 0.1)}, ${darken(color, 0.7)}`
        }}
      />
      <Typography>Estás Conectado a IVAO {ivaoUser.firstName}</Typography>
    </Stack>
  ) : (
    <Stack height='calc(100vh - 64px)' justifyContent='center' alignItems='center'>
      <Paper>
        <Box p={2} textAlign='center'>
          <IvaoConnection user={user} />

          <Image priority width={222} height={73} src='https://static.ivao.aero/img/logos/logo.svg' alt='logo ivao' />
        </Box>
      </Paper>
    </Stack>
  )
}

export default IvaoLogin
