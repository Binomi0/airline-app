import React from 'react'
import dynamic from 'next/dynamic'
const OperationsCenter = dynamic(() => import('routes/Missions/OperationsCenter'), { ssr: false })
import Disconnected from 'components/Disconnected'
import { useRouter } from 'next/router'
import LinearProgress from '@mui/material/LinearProgress'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import AirplanemodeInactiveIcon from '@mui/icons-material/AirplanemodeInactive'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import useOwnedNfts from 'hooks/useOwnedNFTs'

const MissionsPage = () => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const { data: userNfts, isLoading } = useOwnedNfts()

  if (!user) {
    return <Disconnected />
  }

  if (isLoading) {
    return <LinearProgress />
  }

  if (userNfts?.length === 0) {
    return (
      <Container maxWidth='md'>
        <Stack height='calc(100vh - 64px)' alignItems='center' justifyContent='center'>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              borderRadius: 4,
              background: 'linear-gradient(145deg, rgba(20,20,30,0.8) 0%, rgba(10,10,15,0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}
          >
            <Box mb={3} color='text.disabled'>
              <AirplanemodeInactiveIcon sx={{ fontSize: 80, opacity: 0.5 }} />
            </Box>
            <Typography variant='h4' gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              No tienes aeronaves disponibles
            </Typography>
            <Typography variant='body1' paragraph sx={{ color: 'text.secondary', mb: 4, maxWidth: 500, mx: 'auto' }}>
              Para acceder al centro de operaciones y comenzar a volar misiones, necesitas tener al menos una aeronave
              en tu flota. Puedes adquirir una en el Hangar usando tus tokens AIRL.
            </Typography>
            <Button
              variant='contained'
              color='primary'
              size='large'
              onClick={() => router.push('/hangar')}
              sx={{ px: 4, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '1.1rem' }}
            >
              Ir al Hangar
            </Button>
          </Paper>
        </Stack>
      </Container>
    )
  }

  return <OperationsCenter />
}

export default MissionsPage
