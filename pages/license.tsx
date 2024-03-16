import type { NextPage } from 'next'
import styles from 'styles/License.module.css'
import image from 'public/img/airplanes4.png'
import Image from 'next/image'
import serverSidePropsHandler from 'components/ServerSideHandler'
import LicenseView from 'routes/license/LicenseView'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

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
