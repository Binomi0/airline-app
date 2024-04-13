import styles from 'styles/Hangar.module.css'
import Image from 'next/image'
import image from 'public/img/airplanes3.png'
import SettingsView from 'routes/settings/SettingsView'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import type { PageProps } from 'types'
import { useEffect, useState } from 'react'
import axios from 'config/axios'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { useRouter } from 'next/router'
import { AxiosResponse } from 'axios'
import Link from '@mui/material/Link'
import Breadcrumbs from '@mui/material/Breadcrumbs'

const SettingsPage = ({ loading }: PageProps) => {
  const user = useRecoilValue(userState)
  const router = useRouter()
  const [hasBackup, setHasBackup] = useState(false)

  useEffect(() => {
    if (!user) return

    axios.get('api/webauthn/get').then((response: AxiosResponse<{ authenticators: string[] }>) => {
      setHasBackup(!!response.data.authenticators.length)
    })
  }, [user, router])

  return user ? (
    <Box>
      {loading && <LinearProgress />}
      <Box sx={{ position: 'relative' }} my={5}>
        <Image alt='banner' className={styles.background} fill placeholder='blur' priority src={image} />

        <Container>
          <Paper>
            <Box p={2}>
              <Breadcrumbs aria-label='breadcrumb'>
                <Link underline='hover' color='inherit' href='/'>
                  Home
                </Link>
                <Typography color='text.primary'>Settings</Typography>
              </Breadcrumbs>
              <Typography variant='h2'>Settings</Typography>
            </Box>

            <SettingsView hasBackup={hasBackup} user={user} />

            {/* {address && <MyAircrafts />} */}
          </Paper>
        </Container>
      </Box>
    </Box>
  ) : null
}

export default SettingsPage
