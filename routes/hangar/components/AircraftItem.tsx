import React from 'react'
import Image from 'next/image'
import { Box, Typography } from '@mui/material'
import { INft } from 'models/Nft'
import useAircraft from 'hooks/useAircraft'
import styles from 'styles/Hangar.module.css'

interface Props {
  nft: INft
  isActive: boolean
  onClick: () => void
}

const AircraftItem = ({ nft, isActive, onClick }: Props) => {
  const { hasAircraft } = useAircraft(nft.id as string)

  return (
    <Box
      className={`${styles.itemThumbnail} ${isActive ? styles.activeThumbnail : ''}`}
      onClick={onClick}
    >
      <Box className={styles.thumbImageWrapper}>
        <Image
          src={nft.metadata.image as string}
          alt={nft.metadata.name as string}
          fill
          style={{ objectFit: 'contain' }}
        />
      </Box>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography className={styles.thumbTitle}>{nft.metadata.name as string}</Typography>
        {hasAircraft && (
          <Box className={`${styles.statusBadge} ${styles.ownedBadge}`} sx={{ fontSize: '0.6rem !important', py: '2px !important' }}>
            PROPIO
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default React.memo(AircraftItem)
