import React from 'react'
import dynamic from 'next/dynamic'
import { Container, Typography, Box, Paper, Breadcrumbs, Link } from '@mui/material'
import Head from 'next/head'

const MapaTorresControl = dynamic(() => import('components/MapaTorresControl'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 600,
        width: '100%',
        bgcolor: '#030712',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
      }}
    >
      <Box sx={{ color: '#38bdf8', mb: 2 }}>Loading Radar...</Box>
    </Box>
  )
})

const MapPreviewPage = () => {
  return (
    <Box sx={{ bgcolor: '#030712', minHeight: '100vh', py: 4 }}>
      <Head>
        <title>Mapa de Torres de Control | Airport Airline</title>
      </Head>

      <Container maxWidth='lg'>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 1 }}>
            <Link underline='hover' color='inherit' href='/home'>
              Home
            </Link>
            <Typography color='text.primary'>Mapa</Typography>
          </Breadcrumbs>
          <Typography variant='h4' component='h1' gutterBottom fontWeight='bold' color='primary'>
            Monitor de Torres Globales
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Visualización interactiva en tiempo real de los ATCs activos. Selecciona un origen y destino para planificar
            rutas aéreas.
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
          <MapaTorresControl />
        </Paper>

        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant='h6' gutterBottom>
            Información del Desarrollador
          </Typography>
          <ul>
            <li>
              <Typography variant='body2' color='text.secondary'>
                <strong>Fuente de Datos:</strong> IVAO Network api/ivao/atc/tower
              </Typography>
            </li>
            <li>
              <Typography variant='body2' color='text.secondary'>
                <strong>Coordenadas Geodésicas:</strong> Las rutas se trazan siguiendo la curvatura terrestre para mayor
                precisión aeronáutica.
              </Typography>
            </li>
            <li>
              <Typography variant='body2' color='text.secondary'>
                <strong>Interacción:</strong> Haz clic en los iconos de torre para seleccionar el origen (verde) y
                destino (rojo).
              </Typography>
            </li>
          </ul>
        </Box>
      </Container>
    </Box>
  )
}

export default MapPreviewPage
