import type { NextPage } from 'next'
import Image from 'next/image'
import Box from '@mui/material/Box'
import image from 'public/img/Cyb3rYoga.png'
import styles from '../styles/Home.module.css'
import { PageProps } from 'types'
import LinearProgress from '@mui/material/LinearProgress'
import HomeView from 'routes/home/HomeView'

const Home: NextPage<PageProps> = ({ loading }) => {
  return (
    <Box position='relative'>
      <Image alt='banner' className={styles.background} fill placeholder='blur' priority src={image} />
      <Box height={1}>{loading && <LinearProgress />}</Box>

      <HomeView />
    </Box>
  )
}
// export const config = {
//   runtime: 'experimental-edge' // or "nojdejs"
// }

export default Home
