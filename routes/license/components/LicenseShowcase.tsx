import React from 'react'
import Image from 'next/image'
import { Box, Typography, Stack, LinearProgress, Paper, alpha } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { License } from 'config/licenses'
import styles from 'styles/License.module.css'
import StatusBadge from 'components/ui/StatusBadge'
import SpecItem from 'components/ui/SpecItem'

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
      <AnimatePresence mode='wait'>
        <motion.div
          key={license.id}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className={styles.imageShowcase}
        >
          <Paper
            variant='showcaseImage'
            sx={{
              aspectRatio: '1 / 1',
              '& img': {
                filter: isUnlocked ? 'none' : 'grayscale(1) brightness(0.3) contrast(1.2)'
              }
            }}
          >
            <Image src={image} alt={name} fill style={{ objectFit: 'cover' }} priority />

            {!isUnlocked && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: (theme) => alpha(theme.palette.background.default, 0.4),
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  m: 2,
                  borderRadius: '20px',
                  pointerEvents: 'none'
                }}
              >
                <Typography
                  variant='h5'
                  fontWeight={800}
                  sx={{
                    letterSpacing: '2px',
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    color: (theme) => alpha(theme.palette.common.white, 0.9)
                  }}
                >
                  BLOQUEADA
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ display: 'flex' }}
      >
        <Paper variant='glass' sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant='h4' sx={{ mb: 1 }}>
                {name}
              </Typography>
              <StatusBadge status={isUnlocked ? 'success' : 'error'}>
                {isUnlocked ? 'LICENCIA ACTIVA' : 'MÉRITO NO ALCANZADO'}
              </StatusBadge>
            </Box>

            <Typography variant='body1' color='text.secondary' sx={{ lineHeight: 1.6 }}>
              {description}
            </Typography>

            <Box py={1}>
              <SpecItem label='CATEGORÍA' value={type} />
              <SpecItem label='REQUISITO DE VUELO' value={`${minHours} HORAS`} />

              {!isUnlocked && progressToNext > 0 && (
                <Box mt={4}>
                  <Box display='flex' justifyContent='space-between' mb={1.5} alignItems='flex-end'>
                    <Typography variant='caption' fontWeight={700} color='primary' sx={{ letterSpacing: '1px' }}>
                      PROGRESO DE CARRERA
                    </Typography>
                    <Typography variant='h6' fontWeight={800}>
                      {totalHours.toFixed(1)}{' '}
                      <Typography component='span' variant='caption' sx={{ opacity: 0.5 }}>
                        / {minHours}h
                      </Typography>
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant='determinate'
                    value={Math.min(progressToNext, 100)}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: (theme) => alpha(theme.palette.divider, 0.05),
                      border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: (theme) =>
                          `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
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
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.05),
                  border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
                  mt: 'auto'
                }}
              >
                <Typography variant='body2' fontWeight={600} color='success.main' textAlign='center'>
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
