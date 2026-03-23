import styles from 'styles/Settings.module.css'
import SettingsView from 'routes/settings/SettingsView'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import Link from '@mui/material/Link'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from 'utils'

const SettingsPage = () => {
  const user = useRecoilValue(userState)
  const { data } = useQuery({
    queryKey: ['api/webauthn/get'],
    queryFn: () => fetcher('api/webauthn/get')
  })

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

        <SettingsView hasBackup={data?.authenticators.length > 1} user={user} />
      </Container>
    </Box>
  ) : null
}

export default SettingsPage
