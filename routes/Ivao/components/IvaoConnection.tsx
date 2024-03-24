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
}

const IvaoConnection = ({ user }: Props) => (
  <Box my={2}>
    <Stack spacing={2}>
      <Alert severity='warning'>
        <AlertTitle>IVAO clearance is needed to go forward</AlertTitle>
      </Alert>
      <Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
        <Button variant='contained'>
          <Typography
            color='primary.contrastText'
            variant='button'
            component='a'
            href={`https://sso.ivao.aero/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_IVAO_ID}&state=${user.id}&scope=openid profile flight_plans:read bookings:read tracker email&code_challenge_method=${challengeMethod}&code_challenge=${challenge}`}
          >
            Log In with IVAO
          </Typography>
        </Button>
      </Stack>
    </Stack>
  </Box>
)

export default IvaoConnection
