import { Button } from '@mui/material'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { darken } from '@mui/material/styles'
import React, { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { pilotsStore } from 'store/pilots.atom'
import { IvaoUser, User } from 'types'

function base64URLEncode(str: string) {
  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const verifier = '123456'
const challengeMethod = 'plain' // S256
const challenge = base64URLEncode(verifier)

interface Props {
  user: User
  ivaoUser?: IvaoUser
}

const IvaoStatus = ({ user, ivaoUser }: Props) => {
  const [color, setColor] = useState('#fff')
  const pilots = useRecoilValue(pilotsStore)

  const isFlying = useMemo(
    () => pilots.some((pilot) => pilot?.userId.toString() === user.vaUser?.pilotId),
    [pilots, user.vaUser?.pilotId]
  )

  useEffect(() => {
    setColor(isFlying ? '#00FF00' : '#FFF000')
  }, [isFlying])

  return (
    <Box my={2}>
      {!ivaoUser ? (
        <Alert severity='info'>
          <AlertTitle>Conecta tu cuenta de IVAO para continuar</AlertTitle>
          <Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
            <Button variant='contained'>
              <Typography
                color='white'
                variant='button'
                component='a'
                href={`https://sso.ivao.aero/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_IVAO_ID}&state=${user.id}&scope=openid profile location flight_plans:read configuration bookings:read tracker training email birthday&code_challenge_method=${challengeMethod}&code_challenge=${challenge}`}
              >
                Log In
              </Typography>
            </Button>
          </Stack>
        </Alert>
      ) : (
        <Stack direction='row' spacing={2} alignItems='center'>
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
      )}
    </Box>
  )
}

export default IvaoStatus
