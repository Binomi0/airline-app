import React from 'react'
import { Box, Container, Typography, Stack, Button, Paper, Grid } from '@mui/material'
import Head from 'next/head'
import { motion } from 'framer-motion'
import AppleIcon from '@mui/icons-material/Apple'
import WindowsIcon from '@mui/icons-material/Window'
import ComputerIcon from '@mui/icons-material/Computer'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const DownloadView = () => {
  return (
    <Box sx={{ py: 10, minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth='lg'>
        <Grid container spacing={6} alignItems='center'>
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <Typography variant='overline' color='primary' fontWeight={700} gutterBottom sx={{ letterSpacing: 2 }}>
                EXPERIENCIA COMPLETA
              </Typography>
              <Typography variant='h2' component='h1' fontWeight={800} gutterBottom sx={{ lineHeight: 1.1 }}>
                Lleva WeiFly a tu Escritorio
              </Typography>
              <Typography variant='h6' color='text.secondary' paragraph sx={{ mb: 4, maxWidth: '500px' }}>
                Conecta tu simulador (MSFS, X-Plane, P3D) directamente con el ecosistema WeiFly. Nuestra aplicación de
                escritorio gestiona la telemetría en tiempo real y tus recompensas on-chain.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant='contained'
                  size='large'
                  startIcon={<WindowsIcon />}
                  sx={{ borderRadius: 4, px: 4, py: 2, fontWeight: 700 }}
                  disabled
                >
                  Windows (Próximamente)
                </Button>
                <Button
                  variant='outlined'
                  size='large'
                  startIcon={<AppleIcon />}
                  sx={{ borderRadius: 4, px: 4, py: 2, fontWeight: 700 }}
                  disabled
                >
                  macOS (Próximamente)
                </Button>
              </Stack>

              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 2 }}>
                * La versión Alpha estará disponible para testers seleccionados muy pronto.
              </Typography>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  component='img'
                  src='/img/app-preview.png'
                  alt='App Preview'
                  sx={{
                    width: '100%',
                    borderRadius: 7,
                    display: 'block',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                  }}
                  onError={(e: any) => {
                    e.target.src = 'https://placehold.co/600x400/1e293b/white?text=App+Preview'
                  }}
                />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        <Box mt={10}>
          <Typography variant='h4' fontWeight={800} textAlign='center' gutterBottom>
            ¿Por qué la App de Escritorio?
          </Typography>
          <Grid container spacing={4} mt={2}>
            {[
              {
                icon: <ComputerIcon color='primary' />,
                title: 'Conexión Directa',
                desc: 'Sincronización instantánea con SimConnect y FSUIPC sin configuraciones complejas.'
              },
              {
                icon: <ComputerIcon color='primary' />,
                title: 'Seguridad Local',
                desc: 'Tus llaves privadas nunca salen de tu dispositivo. Firma transacciones localmente.'
              },
              {
                icon: <ComputerIcon color='primary' />,
                title: 'Bajo Consumo',
                desc: 'Optimizada para correr en segundo plano sin afectar el rendimiento de tu simulador.'
              }
            ].map((f, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper
                  variant='outlined'
                  sx={{ p: 4, borderRadius: 6, height: '100%', bgcolor: 'rgba(255,255,255,0.02)' }}
                >
                  <Box mb={2}>{f.icon}</Box>
                  <Typography variant='h6' fontWeight={700} gutterBottom>
                    {f.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {f.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default DownloadView
