import React from 'react'
import Image from 'next/image'
import { Box, Typography, Paper } from '@mui/material'
import { License } from 'config/licenses'
import LockIcon from '@mui/icons-material/Lock'
import styles from 'styles/License.module.css'

interface Props {
  license: License
  isActive: boolean
  isUnlocked: boolean
  onClick: () => void
}

const LicenseItemThumbnail: React.FC<Props> = ({ license, isActive, isUnlocked, onClick }) => {
  const { name, image } = license

  return (
    <Paper
      elevation={0}
      variant={isActive ? 'licenseActive' : 'license'}
      className={styles.itemThumbnail}
      onClick={onClick}
    >
      <Box className={styles.thumbImageWrapper}>
        <Image
          src={image}
          alt={name}
          fill
          style={{
            objectFit: 'cover',
            filter: isUnlocked ? 'none' : 'grayscale(1) brightness(0.4) contrast(1.2)'
          }}
        />
        {!isUnlocked && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(2px)'
            }}
          >
            <LockIcon sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.5rem' }} />
          </Box>
        )}
      </Box>
      <Typography className={styles.thumbTitle}>{name}</Typography>
    </Paper>
  )
}

export default React.memo(LicenseItemThumbnail)
