import type { NextPage } from 'next'
import Image from 'next/image'
import { Box, Container, Grid, Typography } from '@mui/material'
import serverSidePropsHandler from 'components/ServerSideHandler'
import HomeGridItem from 'components/HomeGridItem'
import image from 'public/img/Cyb3rYoga.png'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <Box position='relative'>
      <Image alt='banner' className={styles.background} fill placeholder='blur' priority src={image} />

      <Container>
        <Box my={5} textAlign='center'>
          <Typography variant='h1'>Virtual Airline</Typography>
        </Box>

        <Grid container spacing={8}>
          <HomeGridItem
            delay={500}
            link='/hangar'
            title='Hangar &rarr;'
            text="Aircrafts, buy and sell aircraft NFT's"
          />
          <HomeGridItem
            delay={1000}
            link='/license'
            title='Licencias &rarr;'
            text='Grow, adquire a licence and start flying today.'
          />

          <HomeGridItem
            delay={1500}
            link='/gas'
            title='Gas Station &rarr;'
            text='Stake and earn Gas to refuel your aircrafts.'
          />
          <HomeGridItem
            delay={2000}
            link='/cargo'
            title='Cargo &rarr;'
            text='Realiza alguno de los vuelos pendientes y gana tokens
                      AIRL.'
          />
          <HomeGridItem
            delay={2500}
            link='/ivao'
            title='IVAO &rarr;'
            text='Monitoriza tus vuelos en IVAO y gana recompensas.'
          />
        </Grid>
      </Container>
    </Box>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default Home
