import React from 'react'
import Image from 'next/image'
import { Box, Typography, Stack, LinearProgress, Paper, alpha } from '@mui/material'
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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className={styles.imageShowcase}
        >
          <Box className={styles.mainLicenseImage}>
            <Image
              src={image}
              alt={name}
              fill
              style={{
                objectFit: 'cover',
                filter: isUnlocked ? 'none' : 'grayscale(1) brightness(0.3) contrast(1.2)'
              }}
              priority
            />

            {!isUnlocked && (
              <Box
                sx={(theme) => ({
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(15, 23, 42, 0.4)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                  m: 2,
                  borderRadius: '20px',
                  pointerEvents: 'none'
                })}
              >
                <Typography
                  variant='h5'
                  fontWeight={800}
                  sx={{
                    letterSpacing: '2px',
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    color: 'rgba(255,255,255,0.9)'
                  }}
                >
                  BLOQUEADA
                </Typography>
              </Box>
            )}

            {/* Premium Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(225deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none',
                zIndex: 3
              }}
            />
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ display: 'flex' }}
      >
        <Paper variant='glass' className={styles.glassCard} sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant='h4'
                fontWeight={800}
                sx={{
                  fontFamily: 'Sora, sans-serif',
                  lineHeight: 1.1,
                  letterSpacing: '-1px',
                  mb: 1
                }}
              >
                {name}
              </Typography>
              <Box className={`${styles.statusBadge} ${isUnlocked ? styles.ownedBadge : styles.lockedBadge}`}>
                {isUnlocked ? 'LICENCIA ACTIVA' : 'MÉRITO NO ALCANZADO'}
              </Box>
            </Box>

            <Typography variant='body1' color='rgba(255,255,255,0.7)' sx={{ lineHeight: 1.6 }}>
              {description}
            </Typography>

            <Box py={1}>
              <Box className={styles.specRow}>
                <Typography className={styles.specLabel}>CATEGORÍA</Typography>
                <Typography className={styles.specValue}>{type}</Typography>
              </Box>
              <Box className={styles.specRow}>
                <Typography className={styles.specLabel}>REQUISITO DE VUELO</Typography>
                <Typography className={styles.specValue}>{minHours} HORAS</Typography>
              </Box>

              {!isUnlocked && progressToNext > 0 && (
                <Box mt={4}>
                  <Box display='flex' justifyContent='space-between' mb={1.5} alignItems='flex-end'>
                    <Typography variant='caption' fontWeight={700} color='primary' sx={{ letterSpacing: '1px' }}>
                      PROGRESO DE CARRERA
                    </Typography>
                    <Typography variant='h6' fontWeight={800} color='white'>
                      {totalHours.toFixed(1)} <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>/ {minHours}h</span>
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant='determinate'
                    value={Math.min(progressToNext, 100)}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)'
                      }
                    }}
                  />
                </Box>
              )}
            </Box>

            {isUnlocked && (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  bgcolor: 'rgba(34, 197, 94, 0.05)',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                  mt: 'auto'
                }}
              >
                <Typography variant='body2' fontWeight={600} color='#4ade80' textAlign='center'>
                  Operando bajo normativa vigente.
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default React.memo(LicenseShowcase)
