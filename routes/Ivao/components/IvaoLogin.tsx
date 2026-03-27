import { Box, Paper, Stack, Typography, useTheme, alpha } from '@mui/material'
import Image from 'next/image'
import React, { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'
import IvaoConnection from './IvaoConnection'
import { pilotStore } from 'store/pilot.atom'
import { userState } from 'store/user.atom'

const IvaoLogin = () => {
  const theme = useTheme()
  const ivaoUser = useRecoilValue(ivaoUserStore)
  const user = useRecoilValue(userState)
  const pilots = useRecoilValue(pilotStore)

  const isFlying = useMemo(
    () => pilots.some((pilot) => pilot?.userId?.toString() === user?.vaUser?.pilotId),
    [pilots, user?.vaUser?.pilotId]
  )

  const statusColor = isFlying ? theme.palette.success.main : theme.palette.warning.main

  return ivaoUser ? (
    <Stack direction='row' spacing={2} alignItems='center' mt={2}>
      <Box
        sx={{
          width: 32,
          height: 32,
          border: `1px solid ${alpha(statusColor, 0.7)}`,
          borderRadius: '50%',
          background: `linear-gradient(270deg, ${statusColor}, ${alpha(statusColor, 0.3)})`
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
