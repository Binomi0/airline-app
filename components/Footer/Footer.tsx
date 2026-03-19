import React from 'react'
import { Box, Container, Grid, Typography, Stack, IconButton, Divider } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { themeStore } from 'store/theme.atom'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import TelegramIcon from '@mui/icons-material/Telegram'
import styles from './footer.module.css'

const Footer: React.FC = () => {
  const theme = useRecoilValue(themeStore)
  const isDark = theme === 'dark'

  const currentYear = new Date().getFullYear()

  return (
    <Box component='footer' className={`${styles.footer} ${isDark ? styles.dark : styles.light}`}>
      <Container maxWidth='lg'>
        <Grid container spacing={4} py={6}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Stack direction='row' alignItems='center' spacing={1}>
                <Image
                  src={isDark ? '/logo64x64-white.png' : '/logo64x64.png'}
                  alt='WeiFly Logo'
                  width={32}
                  height={32}
                />
                <Typography variant='h6' fontWeight={700} className={styles.brandTitle}>
                  WeiFly
                </Typography>
              </Stack>
              <Typography variant='body2' color='text.secondary' sx={{ maxWidth: '300px' }}>
                Una aerolínea virtual descentralizada basada en Ethereum. Experimenta el futuro de la simulación y
                gestión aeronáutica.
              </Typography>
              <Stack direction='row' spacing={1}>
                <IconButton size='small' color='inherit' className={styles.socialIcon}>
                  <GitHubIcon fontSize='small' />
                </IconButton>
                <IconButton size='small' color='inherit' className={styles.socialIcon}>
                  <TwitterIcon fontSize='small' />
                </IconButton>
                <IconButton size='small' color='inherit' className={styles.socialIcon}>
                  <TelegramIcon fontSize='small' />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant='subtitle1' fontWeight={600} gutterBottom>
              Plataforma
            </Typography>
            <Stack spacing={1}>
              <Link href='/' className={styles.link}>
                Home
              </Link>
              <Link href='/guide' className={styles.link}>
                Guía
              </Link>
              <Link href='/missions' className={styles.link}>
                Misiones
              </Link>
              <Link href='/live' className={styles.link}>
                Live Map
              </Link>
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid item xs={6} md={2}>
            <Typography variant='subtitle1' fontWeight={600} gutterBottom>
              Recursos
            </Typography>
            <Stack spacing={1}>
              <Link href='/hangar' className={styles.link}>
                Hangar
              </Link>
              <Link href='/gas' className={styles.link}>
                Gas Station
              </Link>
              <Link href='/license' className={styles.link}>
                Licencias
              </Link>
              <Link href='/whitepaper.md' className={styles.link}>
                Whitepaper
              </Link>
            </Stack>
          </Grid>

          {/* Community */}
          <Grid item xs={6} md={2}>
            <Typography variant='subtitle1' fontWeight={600} gutterBottom>
              Legal
            </Typography>
            <Stack spacing={1}>
              <Link href='/privacy' className={styles.link}>
                Privacidad
              </Link>
              <Link href='/terms' className={styles.link}>
                Términos
              </Link>
              <Link href='/legal' className={styles.link}>
                Aviso Legal
              </Link>
            </Stack>
          </Grid>

          {/* Community & IVAO */}
          <Grid item xs={12} md={2}>
            <Typography variant='subtitle1' fontWeight={600} gutterBottom>
              Comunidad
            </Typography>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              IVAO Integrated
            </Typography>
            <Box mt={1} className={styles.ivaoBadge}>
              <Typography variant='caption' fontWeight={700}>
                IVAO READY
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ opacity: 0.1 }} />

        <Box py={4} textAlign='center'>
          <Typography variant='caption' color='text.secondary' display='block'>
            © {currentYear} WeiFly. Todos los derechos reservados.
          </Typography>
          <Typography variant='caption' color='primary' sx={{ mt: 1, display: 'inline-block', opacity: 0.8 }}>
            WeiFly se encuentra actualmente en fase Alpha. La aviación virtual no implica riesgo financiero real.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
