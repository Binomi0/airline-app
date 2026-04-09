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
import { WebAuthnUser } from 'types'
import { useTheme, alpha } from '@mui/material/styles'
import { useMemo } from 'react'

const SettingsPage = () => {
  const user = useRecoilValue(userState)
  const { data } = useQuery<WebAuthnUser>({
    queryKey: ['api/webauthn/get'],
    queryFn: () => fetcher('api/webauthn/get')
  })

  const theme = useTheme()

  const dynamicTokens = useMemo(
    () =>
      ({
        '--settings-bg': theme.palette.background.default,
        '--settings-grad-from': alpha(theme.palette.background.default, 0.9),
        '--settings-grad-to': alpha(theme.palette.background.paper, 0.8),
        '--settings-text': theme.palette.text.primary,
        '--settings-text-muted': alpha(theme.palette.text.secondary, 0.6),
        '--settings-border': alpha(theme.palette.divider, 0.1)
      }) as React.CSSProperties,
    [theme]
  )

  return user ? (
    <Box className={styles.pageContainer} style={dynamicTokens}>
      <Box className={styles.backgroundOverlay} />

      <Container className={styles.contentWrapper}>
        <Box className={styles.headerSection}>
          <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
            <Link
              underline='hover'
              className={styles.breadcrumbLink}
              href='/'
              sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
              Home
            </Link>
            <Typography variant='caption' sx={{ color: 'text.primary', opacity: 0.8 }}>
              Settings
            </Typography>
          </Breadcrumbs>
          <Typography variant='h3' className={styles.title} sx={{ color: 'text.primary' }}>
            System Settings
          </Typography>
          <Typography variant='body1' sx={{ color: 'text.secondary', opacity: 0.7 }}>
            Manage your account security, wallet sync, and third-party integrations.
          </Typography>
        </Box>

        <SettingsView hasBackup={(data?.authenticators?.length ?? 0) > 1} user={user} />
      </Container>
    </Box>
  ) : null
}

export default SettingsPage
