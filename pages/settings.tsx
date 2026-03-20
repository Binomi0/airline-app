import styles from 'styles/Settings.module.css'
import SettingsView from 'routes/settings/SettingsView'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import axios from 'config/axios'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { useRouter } from 'next/router'
import { AxiosResponse } from 'axios'
import Link from '@mui/material/Link'
import Breadcrumbs from '@mui/material/Breadcrumbs'

const SettingsPage = () => {
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
    <Box className={styles.pageContainer}>
      <Box className={styles.backgroundOverlay} />

      <Container className={styles.contentWrapper}>
        <Box className={styles.headerSection}>
          <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
            <Link underline='hover' className={styles.breadcrumbLink} href='/'>
              Home
            </Link>
            <Typography className={styles.breadcrumbActive}>Settings</Typography>
          </Breadcrumbs>
          <Typography variant='h3' className={styles.title}>
            System Settings
          </Typography>
          <Typography variant='body1' sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Manage your account security, wallet sync, and third-party integrations.
          </Typography>
        </Box>

        <SettingsView hasBackup={hasBackup} user={user} />
      </Container>
    </Box>
  ) : null
}

export default SettingsPage
