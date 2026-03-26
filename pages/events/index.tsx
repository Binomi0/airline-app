import React from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  useTheme,
  alpha,
  Avatar
} from '@mui/material'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { AIRLINES } from 'config/airlines'
import { useRouter } from 'next/router'
import Image from 'next/image'

const EventsDashboard = () => {
  const theme = useTheme()
  const router = useRouter()

  const airlines = Object.values(AIRLINES)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      <Head>
        <title>Eventos WeiFly | Panel de Aerolíneas</title>
      </Head>

      {/* Hero Section */}
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          mb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth='xl'>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant='h1' sx={{ fontWeight: 900, mb: 2 }}>
              WeiFly Events
            </Typography>
            <Typography variant='h5' sx={{ opacity: 0.8, maxWidth: 600 }}>
              Explora misiones exclusivas y eventos patrocinados por las mejores aerolíneas del mundo.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth='xl'>
        <Typography variant='h4' sx={{ fontWeight: 800, mb: 4 }}>
          Aerolíneas Asociadas
        </Typography>

        <Grid container spacing={4}>
          {airlines.map((airline, index) => (
            <Grid item xs={12} md={4} key={airline.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  variant='glass'
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', height: 200 }}>
                    <Image src={airline.hero} alt={airline.name} layout='fill' objectFit='cover' />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(to bottom, transparent 40%, ${alpha(airline.color, 0.8)} 100%)`
                      }}
                    />
                    <Avatar
                      src={airline.logo}
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        width: 56,
                        height: 56,
                        border: '3px solid white',
                        bgcolor: 'white'
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <Typography variant='h5' fontWeight={800} gutterBottom>
                      {airline.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                      {airline.description}
                    </Typography>
                    <Stack direction='row' spacing={1} mb={3}>
                      <Box
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: alpha(airline.color, 0.1),
                          color: airline.color,
                          fontWeight: 'bold',
                          fontSize: '0.75rem'
                        }}
                      >
                        {airline.overlay}
                      </Box>
                    </Stack>
                    <Button
                      variant='contained'
                      fullWidth
                      size='large'
                      onClick={() => router.push(`/events/${airline.id}`)}
                      sx={{
                        bgcolor: airline.color,
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: alpha(airline.color, 0.8) }
                      }}
                    >
                      VER VUELOS
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default EventsDashboard
