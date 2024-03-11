import type { NextPage } from 'next'
import { Box, Container, Typography } from '@mui/material'
import styles from 'styles/License.module.css'
import image from 'public/img/airplanes4.png'
import Image from 'next/image'
import serverSidePropsHandler from 'components/ServerSideHandler'
import LicenseView from 'routes/license/LicenseView'

const License: NextPage = () => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Image priority className={styles.background} src={image} alt='banner' fill />

      <Container>
        <Box my={5} textAlign='center'>
          <Typography variant='h1'>License Page</Typography>
        </Box>

        <LicenseView />
      </Container>
    </Box>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default License
