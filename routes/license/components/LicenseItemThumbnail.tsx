import React from 'react'
import Image from 'next/image'
import { Box, Typography } from '@mui/material'
import { INft } from 'models/Nft'
import styles from 'styles/License.module.css'

interface Props {
  nft: INft
  isActive: boolean
  onClick: () => void
}

const LicenseItemThumbnail: React.FC<Props> = ({ nft, isActive, onClick }) => {
  const { name, image } = nft.metadata

  return (
    <Box className={`${styles.itemThumbnail} ${isActive ? styles.activeThumbnail : ''}`} onClick={onClick}>
      <Box className={styles.thumbImageWrapper}>
        <Image src={image as string} alt={name as string} fill style={{ objectFit: 'cover' }} />
        {/* Subtle Glossy Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%)',
            pointerEvents: 'none'
          }}
        />
      </Box>
      <Typography className={styles.thumbTitle}>{name}</Typography>
    </Box>
  )
}

export default React.memo(LicenseItemThumbnail)
