import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Container, Typography, Box, Paper, Grid, Chip } from '@mui/material'
import RoadmapTimeline from 'components/Roadmap/RoadmapTimeline'
import IncomeDistribution from 'components/Roadmap/IncomeDistribution'
import TreasuryStructure from 'components/Roadmap/TreasuryStructure'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'

const RoadmapPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Roadmap | WeiFly Protocol</title>
      </Head>
      <Container maxWidth='lg' sx={{ py: 10, mt: 4 }}>
        <Box textAlign='center' mb={10}>
          <Typography
            variant='overline'
            color='primary'
            sx={{ fontWeight: 800, letterSpacing: 3, mb: 1, display: 'block' }}
          >
            ESTRATEGIA DE DESCENTRALIZACIÓN
          </Typography>
          <Typography
            variant='h1'
            component='h1'
            gutterBottom
            sx={{
              fontWeight: 900,
              fontSize: { xs: '3rem', md: '5rem' },
              background: 'linear-gradient(90deg, #fff 0%, #aaa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
              mb: 3,
              fontFamily: 'Sora, sans-serif'
            }}
          >
            WeiFly Roadmap
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
            <Chip
              icon={<FlightTakeoffIcon sx={{ color: 'inherit !important' }} />}
              label='FASE 1: FUNDACIÓN'
              color='primary'
              sx={{
                fontWeight: 900,
                px: 2,
                py: 2.5,
                borderRadius: 2,
                fontSize: '0.9rem',
                boxShadow: '0 0 20px rgba(76, 175, 80, 0.3)'
              }}
            />
          </Box>
        </Box>

        <Box mb={15}>
          <Typography
            variant='h2'
            gutterBottom
            sx={{
              fontWeight: 900,
              textAlign: 'center',
              mb: 8,
              fontFamily: 'Sora, sans-serif',
              fontSize: { xs: '2rem', md: '3.5rem' }
            }}
          >
            Línea de Tiempo
          </Typography>
          <RoadmapTimeline />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper
              variant='glass'
              sx={{
                p: { xs: 4, md: 6 },
                height: '100%',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <Typography variant='h4' gutterBottom sx={{ fontWeight: 900, mb: 4, fontFamily: 'Sora, sans-serif' }}>
                Sostenibilidad
              </Typography>
              <IncomeDistribution />
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              variant='glass'
              sx={{
                p: { xs: 4, md: 6 },
                height: '100%',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <Typography variant='h4' gutterBottom sx={{ fontWeight: 900, mb: 4, fontFamily: 'Sora, sans-serif' }}>
                Gobernanza
              </Typography>
              <TreasuryStructure />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              variant='glass'
              sx={{
                p: 6,
                borderRadius: 4,
                background: 'linear-gradient(rgba(255,255,255,0.05), rgba(76, 175, 80, 0.05))',
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}
            >
              <Typography variant='h4' gutterBottom sx={{ fontWeight: 900, mb: 2, fontFamily: 'Sora, sans-serif' }}>
                Contratos Verificados
              </Typography>
              <Typography variant='body1' color='text.secondary' mb={4}>
                Transparencia total. Todos los contratos del protocolo son abiertos y verificables en Arbiscan.
              </Typography>
              <Grid container spacing={2}>
                {['DAO MULTISIG', 'TREASURY CONTROLLER', 'NFT LICENSE', 'FLIGHT ENGINE'].map((label) => (
                  <Grid item xs={12} sm={6} md={3} key={label}>
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: 'rgba(255,255,255,0.02)',
                        textAlign: 'center',
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <Typography
                        variant='caption'
                        display='block'
                        sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}
                      >
                        {label}
                      </Typography>
                      <Typography variant='body2' sx={{ fontFamily: 'monospace', opacity: 0.5, letterSpacing: 1 }}>
                        0x... PROX
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box textAlign='center' mt={6} pb={10}>
              <Typography variant='body2' color='text.secondary' sx={{ opacity: 0.6 }}>
                * Fechas y métricas sujetas a evolución del mercado y crecimiento de la comunidad.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default RoadmapPage
