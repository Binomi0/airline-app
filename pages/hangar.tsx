import type { NextPage } from 'next'
import { Box, Container, LinearProgress, Typography } from '@mui/material'
import AircraftMarketPlace from 'components/AircraftMarketPlace'
import styles from 'styles/Hangar.module.css'
import Image from 'next/image'
import image from 'public/img/airplanes3.png'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { ConnectWallet, useUser } from '@thirdweb-dev/react'

interface HangarProps {
  loading: boolean
}

const Hangar: NextPage<HangarProps> = ({ loading }) => {
  const { isLoading, isLoggedIn } = useUser()

  if (loading || isLoading) {
    return <LinearProgress />
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Image alt='banner' className={styles.background} fill placeholder='blur' priority src={image} />
      <Container>
        <Box my={5} textAlign='center'>
          <Typography variant='h1'>Main Hangar</Typography>
          {!isLoggedIn && <ConnectWallet />}
        </Box>

        <AircraftMarketPlace />

        {/* {address && <MyAircrafts />} */}
      </Container>
    </Box>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default Hangar
