import React, { FC, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import { useRecoilValue } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'
import { userState } from 'store/user.atom'
import { formatSecondsToHoursMinutes } from 'utils'

interface Props {
  onNext: () => void
}

// Generar valores PKCE seguros
const generatePKCE = async () => {
  const verifier = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return { verifier, challenge, challengeMethod: 'S256' }
}

const StepIVAO: FC<Props> = ({ onNext }) => {
  const ivaoUser = useRecoilValue(ivaoUserStore)
  const user = useRecoilValue(userState)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (!user?.id) return

    setIsConnecting(true)
    try {
      // Generar PKCE seguro
      const { verifier, challenge, challengeMethod } = await generatePKCE()

      // Guardar verifier en sessionStorage para usarlo en el callback
      sessionStorage.setItem('ivao_pkce_verifier', verifier)
      sessionStorage.setItem('ivao_state', user.id) // No ideal, pero mejor que antes

      // Generar state aleatorio
      const state = crypto.randomUUID()
      sessionStorage.setItem('oauth_state', state)

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.NEXT_PUBLIC_IVAO_ID!,
        redirect_uri: `${window.location.origin}/auth/ivao-callback`,
        scope: 'openid profile flight_plans:read bookings:read tracker email',
        code_challenge_method: challengeMethod,
        code_challenge: challenge,
        state: state
      })

      window.location.href = `https://sso.ivao.aero/authorize?${params.toString()}`
    } catch (error) {
      console.error('Failed to initialize OAuth', error)
      setIsConnecting(false)
    }
  }

  // Safe access to hours
  const pilotHoursMatch = ivaoUser?.hours?.find((h) => h.type?.toLowerCase().includes('pilot'))
  const atcHoursMatch = ivaoUser?.hours?.find((h) => h.type?.toLowerCase().includes('atc'))
  const pilotHours = pilotHoursMatch?.hours ?? 0
  const atcHours = atcHoursMatch?.hours ?? 0

  return (
    <Box textAlign='center'>
      <Typography variant='h4' gutterBottom>
        Connect your IVAO Account
      </Typography>

      {ivaoUser ? (
        <Box my={4}>
          <Typography variant='h6' color='success.main' gutterBottom>
            Successfully connected as {ivaoUser.firstName} {ivaoUser.lastName}!
          </Typography>
          <Typography variant='body2' color='text.secondary' paragraph>
            We have synced your IVAO career data. Here is your current status:
          </Typography>

          <Box mb={2}>
            <Typography variant='caption' color='text.secondary'>
              Division
            </Typography>
            <Typography variant='h6'>{ivaoUser.divisionId || 'N/A'}</Typography>
          </Box>

          {ivaoUser.rating?.isPilot && (
            <Paper elevation={2} sx={{ p: 2, background: 'rgba(255,255,255,0.05)', my: 2 }}>
              <Stack direction='row' justifyContent='space-around'>
                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Pilot Rating
                  </Typography>
                  <Typography variant='h6'>{ivaoUser.rating.pilotRating?.shortName || 'N/A'}</Typography>
                </Box>

                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Hours
                  </Typography>
                  <Typography variant='h6'>{formatSecondsToHoursMinutes(pilotHours)}</Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          {ivaoUser.rating?.isAtc && (
            <Paper elevation={2} sx={{ p: 2, background: 'rgba(255,255,255,0.05)', my: 2 }}>
              <Stack direction='row' justifyContent='space-around'>
                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    ATC Rating
                  </Typography>
                  <Typography variant='h6'>{ivaoUser.rating.atcRating?.shortName || 'N/A'}</Typography>
                </Box>

                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Hours
                  </Typography>
                  <Typography variant='h6'>{formatSecondsToHoursMinutes(atcHours)}</Typography>
                </Box>
              </Stack>
            </Paper>
          )}
        </Box>
      ) : (
        <Box my={4}>
          <Typography variant='body1' paragraph>
            Connect your IVAO account to log flights, earn rewards, and sync your career progress.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={handleConnect}
            disabled={isConnecting}
            startIcon={isConnecting && <CircularProgress size={20} />}
          >
            {isConnecting ? 'Connecting...' : 'Connect IVAO'}
          </Button>
        </Box>
      )}

      <Box mt={4} display='flex' justifyContent='flex-end'>
        {ivaoUser ? (
          <Button onClick={onNext} variant='contained' color='primary'>
            Continue
          </Button>
        ) : (
          <Button onClick={onNext} variant='text' disabled={isConnecting}>
            Skip for now
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default StepIVAO
