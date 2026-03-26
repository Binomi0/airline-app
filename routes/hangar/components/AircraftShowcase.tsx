import React, { useMemo } from 'react'
import Image from 'next/image'
import { Box, Typography, Button, Stack } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { INft } from 'models/Nft'
import { getNFTAttributes } from 'utils'
import styles from 'styles/Hangar.module.css'
import { useNFTProviderContext } from 'context/NFTProvider'
import CreateListingModal from 'routes/marketplace/components/CreateListingModal'

interface Props {
  nft: INft
  isClaiming: boolean
  hasAircraft: boolean
  onClaim: () => void
}

const attributeFields = ['range', 'license', 'cargo', 'combustible', 'price']

const AircraftShowcase: React.FC<Props> = ({ nft, isClaiming, hasAircraft, onClaim }) => {
  const attributes = useMemo(() => getNFTAttributes(nft), [nft])
  const name = nft.metadata.name as string
  const image = nft.metadata.image as string
  const description = nft.metadata.description as string
  const { licenses } = useNFTProviderContext()

  const specs = useMemo(
    () => attributes.filter((attr) => attributeFields.includes(attr.trait_type.toLowerCase())),
    [attributes]
  )

  const licenseId = useMemo(
    () => attributes.find((attr) => attr.trait_type.toLowerCase() === 'license')?.value,
    [attributes]
  )

  const license = useMemo(() => licenses.find((license) => license.id === licenseId), [licenses, licenseId])

  const price = useMemo(() => attributes.find((attr) => attr.trait_type.toLowerCase() === 'price')?.value, [attributes])
  const [isListingModalOpen, setIsListingModalOpen] = React.useState(false)

  return (
    <Box className={styles.showcaseContainer}>
      <CreateListingModal 
        open={isListingModalOpen} 
        onClose={() => setIsListingModalOpen(false)} 
        nft={nft} 
      />
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
          <Box className={styles.mainAircraftImageContainer}>
            <Image
              src={image}
              alt={name}
              fill
              style={{ objectFit: 'cover' }}
              className={styles.mainAircraftImage}
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
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)',
                pointerEvents: 'none',
                opacity: 0.4
              }}
            />
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
            {description}
          </Typography>
        </Stack>

        <Box>
          {specs.map((spec) => {
            if (hasAircraft && spec.trait_type.toLowerCase() === 'price') return null
            return (
              <Box key={spec.trait_type} className={styles.specRow}>
                <Typography className={styles.specLabel}>{spec.trait_type.replace('_', ' ')}</Typography>
                {spec.trait_type.toLowerCase() === 'license' ? (
                  <Box className={styles.specValue}>
                    <Image
                      src={license?.metadata.image as string}
                      alt={license?.metadata.name as string}
                      width={20}
                      height={20}
                    />
                  </Box>
                ) : (
                  <Typography className={styles.specValue}>
                    {spec.trait_type.toLowerCase() === 'price' ? `${spec.value} AIRL` : spec.value}
                  </Typography>
                )}
              </Box>
            )
          })}
        </Box>

        {hasAircraft ? (
          <Button
            fullWidth
            variant='contained'
            size='large'
            className={styles.claimButton}
            onClick={() => setIsListingModalOpen(true)}
            sx={{ mt: 2, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
          >
            Listar en Marketplace
          </Button>
        ) : (
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
