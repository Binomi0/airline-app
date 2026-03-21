import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Container, Typography, Box, Paper, Button } from '@mui/material'

const ATCPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Controladores Aéreos | WeiFly</title>
      </Head>
      <Container maxWidth='md' sx={{ py: 8, mt: 8 }}>
        <Box textAlign='center' mb={6}>
          <Typography variant='h3' component='h1' gutterBottom fontWeight='bold'>
            Tu radar ahora mina recompensas
          </Typography>
          <Typography variant='h6' color='text.secondary' sx={{ mb: 4 }}>
            Bienvenido al centro neurálgico para Controladores Aéreos (ATC) de WeiFly.
          </Typography>
        </Box>

        <Paper variant='glass' sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant='h5' gutterBottom fontWeight='bold'>
            [ ATC Dashboard en Construcción ]
          </Typography>
          <Typography variant='body1' color='text.secondary' paragraph sx={{ mb: 4 }}>
            Próximamente: Integración con la API de IVAO para minería Proof-of-Control, recepción de propinas on-chain,
            sistema de reputación (Kudos) y tabla de misiones (Bounties).
          </Typography>
          <Button variant='contained' color='primary' size='large' disabled>
            Vincular cuenta de IVAO
          </Button>
        </Paper>
      </Container>
    </>
  )
}

export default ATCPage
