import styles from 'styles/Hangar.module.css'
import Image from 'next/image'
import image from 'public/img/airplanes3.png'
import HangarView from 'routes/hangar/HangarView'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import type { PageProps } from 'types'

const Hangar = ({ loading }: PageProps) => (
  <Box sx={{ position: 'relative' }}>
    <Image alt='banner' className={styles.background} fill placeholder='blur' priority src={image} />
    {loading && <LinearProgress />}

    <Container>
      <Box my={5} textAlign='center'>
        <Typography variant='h1'>Main Hangar</Typography>
      </Box>

      <HangarView />

      {/* {address && <MyAircrafts />} */}
    </Container>
  </Box>
)

export default Hangar
