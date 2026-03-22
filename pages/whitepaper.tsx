import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Container, Typography, Box, Paper, Divider } from '@mui/material'

const WhitepaperPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Whitepaper | WeiFly</title>
      </Head>
      <Container maxWidth='md' sx={{ py: 8, mt: 4 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, bgcolor: 'background.paper' }}>
          <Typography variant='h3' component='h1' gutterBottom fontWeight='bold' color='primary'>
            WeiFly - Aerolínea Virtual Basada en Ethereum
          </Typography>

          <Box my={4}>
            <Typography variant='h5' gutterBottom fontWeight='bold'>
              Introducción
            </Typography>
            <Typography variant='body1' paragraph color='text.secondary'>
              WeiFly es una innovadora plataforma de aerolínea virtual construida sobre la tecnología blockchain de
              Ethereum. Nuestra plataforma revoluciona la industria de la simulación de vuelo al ofrecer una experiencia
              única y emocionante para los entusiastas de la aviación y los usuarios interesados en la tecnología
              blockchain.
            </Typography>
          </Box>

          <Box my={4}>
            <Typography variant='h5' gutterBottom fontWeight='bold'>
              Visión
            </Typography>
            <Typography variant='body1' paragraph color='text.secondary'>
              Nuestra visión en WeiFly es crear una comunidad global de pilotos virtuales que puedan explorar el mundo
              desde la comodidad de sus hogares. Queremos democratizar el acceso a la aviación virtual y proporcionar
              una plataforma segura, transparente y emocionante para que los usuarios disfruten de la simulación de
              vuelo.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box my={4}>
            <Typography variant='h5' gutterBottom fontWeight='bold'>
              Características Principales
            </Typography>

            <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
              Tokenomics Innovadores
            </Typography>
            <Typography variant='body1' paragraph color='text.secondary'>
              WeiFly introduce un ecosistema de tokens único que impulsa la economía de la aerolínea virtual. Con
              nuestro token principal, AIRL, y el token secundario, AIRG, los usuarios pueden acceder a una variedad de
              servicios y funciones dentro de la plataforma.
            </Typography>

            <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
              Licencias y Aeronaves Tokenizadas
            </Typography>
            <Typography variant='body1' paragraph color='text.secondary'>
              Las licencias de vuelo y las aeronaves se representan como tokens no fungibles (NFT) en la blockchain de
              Ethereum. Esto garantiza la propiedad y la autenticidad de cada licencia y aeronave, ofreciendo a los
              usuarios un alto nivel de seguridad y transparencia.
            </Typography>

            <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
              Contrato Inteligente de Staking
            </Typography>
            <Typography variant='body1' paragraph color='text.secondary'>
              Implementa un contrato inteligente de staking que permite a los usuarios ganar tokens AIRG al depositar
              sus tokens AIRL. Esta función proporciona una forma efectiva de participar en la plataforma y obtener el
              combustible necesario para realizar los vuelos.
            </Typography>
          </Box>

          <Box my={4}>
            <Typography variant='h5' gutterBottom fontWeight='bold'>
              Detalles Técnicos
            </Typography>
            <Typography variant='body1' paragraph color='text.secondary'>
              WeiFly se basa en la tecnología blockchain de Ethereum y Arbitrum para garantizar la seguridad, la
              transparencia y la descentralización de la plataforma. La integración de contratos inteligentes permite
              una ejecución eficiente y automatizada de las operaciones dentro de la aerolínea virtual.
            </Typography>
          </Box>

          <Box my={4}>
            <Typography variant='h5' gutterBottom fontWeight='bold'>
              Roadmap y Desarrollo Futuro
            </Typography>
            <Typography variant='body1' paragraph color='text.secondary'>
              WeiFly se encuentra en una etapa inicial de desarrollo (Alpha). Nuestro roadmap incluye el lanzamiento de
              nuevas características, la integración profunda con IVAO y la expansión de nuestra comunidad de usuarios y
              flota disponible.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  )
}

export default WhitepaperPage
