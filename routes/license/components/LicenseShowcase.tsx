import React, { useMemo } from 'react'
import Image from 'next/image'
import { Box, Typography, Button, Stack } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { INft } from 'models/Nft'
import { getNFTAttributes } from 'utils'
import styles from 'styles/License.module.css'

interface Props {
  nft: INft
  isClaiming: boolean
  owned: boolean
  onClaim: () => void
}

const LicenseShowcase: React.FC<Props> = ({ nft, isClaiming, owned, onClaim }) => {
  const attributes = useMemo(() => getNFTAttributes(nft), [nft])
  const { name, image, description } = nft.metadata
  
  const priceAttr = attributes.find(attr => attr.trait_type.toLowerCase() === 'price')
  const price = priceAttr?.value

  // Other specs to show (excluding price)
  const specs = attributes.filter(attr => attr.trait_type.toLowerCase() !== 'price')

  return (
    <Box className={styles.showcaseContainer}>
      {/* Cinematic Image Showcase */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={nft.id.toString()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={styles.imageShowcase}
        >
          <Box className={styles.mainLicenseImage} position='relative' width='100%'>
            <Image
              src={image as string}
              alt={name as string}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            {/* Glossy Overlay */}
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)',
                pointerEvents: 'none',
                opacity: 0.5
              }} 
            />
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={styles.glassCard}
      >
        <Stack spacing={1}>
          <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
            <Typography variant='h4' fontWeight={700} sx={{ fontFamily: 'Sora, sans-serif' }}>
              {name}
            </Typography>
            <Box className={`${styles.statusBadge} ${owned ? styles.ownedBadge : styles.lockedBadge}`}>
              {owned ? 'Obtenida' : 'Bloqueada'}
            </Box>
          </Box>
          <Typography variant='body2' color='rgba(255,255,255,0.6)'>
            {description}
          </Typography>
        </Stack>

        <Box py={2}>
          {specs.map((spec) => (
            <Box key={spec.trait_type} className={styles.specRow}>
              <Typography className={styles.specLabel}>{spec.trait_type}</Typography>
              <Typography className={styles.specValue}>{spec.value}</Typography>
            </Box>
          ))}
          {price && (
            <Box className={styles.specRow}>
              <Typography className={styles.specLabel}>Precio</Typography>
              <Typography className={styles.specValue} sx={{ color: '#6366f1' }}>
                {price} AIRL
              </Typography>
            </Box>
          )}
        </Box>

        {!owned && (
          <Button
            fullWidth
            variant='contained'
            size='large'
            className={styles.claimButton}
            onClick={onClaim}
            disabled={isClaiming}
          >
            {isClaiming ? 'Procesando...' : `Adquirir Licencia`}
          </Button>
        )}
      </motion.div>
    </Box>
  )
}

export default React.memo(LicenseShowcase)
