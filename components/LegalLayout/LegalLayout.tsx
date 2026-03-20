import React from 'react'
import { Box, Container, Typography } from '@mui/material'
import styles from 'styles/Legal.module.css'

interface LegalLayoutProps {
  title: string
  children: React.ReactNode
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ title, children }) => {
  return (
    <Box className={styles.pageContainer}>
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
