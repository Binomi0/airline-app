import type { NextPage } from 'next'
import Box from '@mui/material/Box'
import styles from '../styles/Home.module.css'
import { PageProps } from 'types'
import LinearProgress from '@mui/material/LinearProgress'
import HomeView from 'routes/home/HomeView'

const Home: NextPage<PageProps> = ({ loading }) => {
  return (
    <Box position='relative'>
      <img alt='banner' className={styles.background} src='/img/Cyb3rYoga.png' />
      <Box height={1}>{loading && <LinearProgress />}</Box>

      <HomeView />
    </Box>
  )
}

export default Home
