import type { NextPage } from 'next'
import Box from '@mui/material/Box'
import styles from '../styles/Home.module.css'
import { PageProps } from 'types'
import LinearProgress from '@mui/material/LinearProgress'
import HomeView from 'routes/home/HomeView'
import Image from 'next/image'
import bannerImage from 'public/img/Cyb3rYoga.png'

const Home: NextPage<PageProps> = ({ loading }) => {
  return (
    <Box position='relative'>
      <Image alt='banner' className={styles.background} src={bannerImage} fill />
      <Box height={1}>{loading && <LinearProgress />}</Box>

      <HomeView />
    </Box>
  )
}

export default Home
