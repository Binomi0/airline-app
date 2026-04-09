import { Box, Container, Typography, useTheme, alpha } from '@mui/material'
import styles from 'styles/Legal.module.css'
import { useMemo } from 'react'

interface LegalLayoutProps {
  title: string
  children: React.ReactNode
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ title, children }) => {
  const theme = useTheme()

  const dynamicTokens = useMemo(
    () =>
      ({
        '--legal-bg': theme.palette.weifly.legal.bg,
        '--legal-text': theme.palette.text.primary,
        '--legal-overlay-from': theme.palette.weifly.legal.overlay.from,
        '--legal-overlay-to': theme.palette.weifly.legal.overlay.to,
        '--legal-glass-bg': theme.palette.weifly.legal.glass.bg,
        '--legal-glass-border': alpha(theme.palette.divider, 0.1),
        '--legal-accent': theme.palette.primary.main
      }) as React.CSSProperties,
    [theme]
  )

  return (
    <Box className={styles.pageContainer} style={dynamicTokens}>
      <div className={styles.backgroundOverlay} />

      <Container className={styles.contentWrapper}>
        <Box className={styles.glassCard}>
          <Typography variant='h1' className={styles.title}>
            {title}
          </Typography>
          <Box className={styles.content}>{children}</Box>
        </Box>
      </Container>
    </Box>
  )
}

export default LegalLayout
