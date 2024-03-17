import styles from 'styles/License.module.css'
import image from 'public/img/airplanes4.png'
import Image from 'next/image'
import LicenseView from 'routes/license/LicenseView'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import type { PageProps } from 'types'

const License = ({ loading }: PageProps) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Image priority className={styles.background} src={image} alt='banner' fill />
      {loading && <LinearProgress />}

      <Container>
        <Box my={5} textAlign='center'>
          <Typography variant='h1'>License Page</Typography>
        </Box>

        <LicenseView />
      </Container>
    </Box>
  )
}

export default License
