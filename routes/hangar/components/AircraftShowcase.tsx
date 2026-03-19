import React, { useMemo } from 'react'
import Image from 'next/image'
import { Box, Typography, Button, Stack } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { INft } from 'models/Nft'
import { getNFTAttributes } from 'utils'
import styles from 'styles/Hangar.module.css'

interface Props {
  nft: INft
  isClaiming: boolean
  hasAircraft: boolean
  onClaim: () => void
}

const AircraftShowcase: React.FC<Props> = ({ nft, isClaiming, hasAircraft, onClaim }) => {
  const attributes = useMemo(() => getNFTAttributes(nft), [nft])
  const name = nft.metadata.name as string
  const image = nft.metadata.image as string

  // Extract key specs
  const specs = useMemo(() => {
    return attributes.filter((attr) =>
      ['range', 'cruise_speed', 'capacity', 'license_required', 'price'].includes(attr.trait_type.toLowerCase())
    )
  }, [attributes])

  const price = attributes.find((attr) => attr.trait_type.toLowerCase() === 'price')?.value

  return (
    <Box className={styles.showcaseContainer}>
      {/* Cinematic Image Showcase */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={nft.id.toString()}
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={styles.imageShowcase}
        >
          <Box position='relative' width='100%' height='400px'>
            <Image src={image} alt={name} fill className={styles.mainAircraftImage} priority />
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Technical Specs Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={styles.glassCard}
      >
        <Stack spacing={1}>
          <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
            <Typography variant='h4' fontWeight={700} sx={{ fontFamily: 'Sora, sans-serif' }}>
              {name}
            </Typography>
            <Box className={`${styles.statusBadge} ${hasAircraft ? styles.ownedBadge : styles.lockedBadge}`}>
              {hasAircraft ? 'Propiedad' : 'Disponible'}
            </Box>
          </Box>
          <Typography variant='body2' color='rgba(255,255,255,0.6)' sx={{ mb: 2 }}>
            Configuración técnica y especificaciones de vuelo.
          </Typography>
        </Stack>

        <Box>
          {specs.map((spec) => (
            <Box key={spec.trait_type} className={styles.specRow}>
              <Typography className={styles.specLabel}>{spec.trait_type.replace('_', ' ')}</Typography>
              <Typography className={styles.specValue}>
                {spec.trait_type.toLowerCase() === 'price' ? `${spec.value} AIRL` : spec.value}
              </Typography>
            </Box>
          ))}
        </Box>

        {!hasAircraft && (
          <Button
            fullWidth
            variant='contained'
            size='large'
            className={styles.claimButton}
            onClick={onClaim}
            disabled={isClaiming}
          >
            {isClaiming ? 'Procesando...' : `Adquirir por ${price} AIRL`}
          </Button>
        )}
      </motion.div>
    </Box>
  )
}

export default AircraftShowcase
