import React from 'react'
import Image from 'next/image'
import { Box, Typography, Stack, LinearProgress } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { License } from 'config/licenses'
import styles from 'styles/License.module.css'

interface Props {
  license: License
  isUnlocked: boolean
  totalHours: number
  progressToNext: number
}

const LicenseShowcase: React.FC<Props> = ({ license, isUnlocked, totalHours, progressToNext }) => {
  const { name, image, description, minHours, type } = license

  return (
    <Box className={styles.showcaseContainer}>
      {/* Cinematic Image Showcase */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={license.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={styles.imageShowcase}
        >
          <Box className={styles.mainLicenseImage} position='relative' width='100%'>
            <Image src={image} alt={name} fill style={{ objectFit: 'cover' }} priority />
            {/* Glossy Overlay */}
            {!isUnlocked && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'grayscale(1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}
              >
                <Typography variant="h5" fontWeight={700} sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  BLOQUEADA
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)',
                pointerEvents: 'none',
                opacity: 0.5,
                zIndex: 3
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
            <Typography variant='h4' fontWeight={700} sx={{ fontFamily: 'Sora, sans-serif', lineHeight: 1.2 }}>
              {name}
            </Typography>
          </Box>
          <Box className={`${styles.statusBadge} ${isUnlocked ? styles.ownedBadge : styles.lockedBadge}`}>
            {isUnlocked ? 'Obtenida' : 'Requisito no cumplido'}
          </Box>
          <Typography variant='body2' color='rgba(255,255,255,0.6)' sx={{ minHeight: '60px' }}>
            {description}
          </Typography>
        </Stack>

        <Box py={2}>
          <Box className={styles.specRow}>
            <Typography className={styles.specLabel}>Tipo</Typography>
            <Typography className={styles.specValue}>{type}</Typography>
          </Box>
          <Box className={styles.specRow}>
            <Typography className={styles.specLabel}>Mínimo Horas</Typography>
            <Typography className={styles.specValue}>{minHours}h</Typography>
          </Box>
          
          {!isUnlocked && progressToNext > 0 && (
            <Box mt={3}>
              <Box display='flex' justifyContent='space-between' mb={1}>
                <Typography variant="caption" color="rgba(255,255,255,0.5)">PROGRESO</Typography>
                <Typography variant="caption" fontWeight={700}>{totalHours.toFixed(1)} / {minHours}h</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progressToNext} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4, 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #6366f1, #a855f7)'
                  }
                }} 
              />
            </Box>
          )}
        </Box>

        {isUnlocked && (
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 3, 
              bgcolor: 'rgba(34, 197, 94, 0.1)', 
              border: '1px solid rgba(34, 197, 94, 0.2)',
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" fontWeight={600} color="#22c55e">
              ¡Licencia activa! Tienes permiso para operar aeronaves de esta categoría.
            </Typography>
          </Box>
        )}
      </motion.div>
    </Box>
  )
}

export default React.memo(LicenseShowcase)
