import React from 'react'
import Image from 'next/image'
import { Box, Typography } from '@mui/material'
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
    <Box 
      className={`${styles.itemThumbnail} ${isActive ? styles.activeThumbnail : ''}`} 
      onClick={onClick}
      sx={{
        opacity: isUnlocked ? 1 : 0.6,
        filter: isUnlocked ? 'none' : 'grayscale(0.8)',
        position: 'relative'
      }}
    >
      <Box className={styles.thumbImageWrapper}>
        <Image src={image} alt={name} fill style={{ objectFit: 'cover' }} />
        {!isUnlocked && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            <LockIcon sx={{ color: 'white', fontSize: '2rem' }} />
          </Box>
        )}
        {/* Subtle Glossy Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%)',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />
      </Box>
      <Typography className={styles.thumbTitle} sx={{ fontSize: '0.8rem', opacity: 0.9 }}>
        {name}
      </Typography>
    </Box>
  )
}

export default React.memo(LicenseItemThumbnail)
