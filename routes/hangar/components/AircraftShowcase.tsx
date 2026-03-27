import React, { useMemo } from 'react'
import Image from 'next/image'
import { Box, Typography, Button, Stack, Paper } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { INft } from 'models/Nft'
import { getNFTAttributes } from 'utils'
import { useNFTProviderContext } from 'context/NFTProvider'
import CreateListingModal from 'routes/marketplace/components/CreateListingModal'
import StatusBadge from 'components/ui/StatusBadge'
import SpecItem from 'components/ui/SpecItem'

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

  const license = useMemo(() => licenses.find((lic) => lic.id === licenseId), [licenses, licenseId])
  const price = useMemo(() => attributes.find((attr) => attr.trait_type.toLowerCase() === 'price')?.value, [attributes])
  const [isListingModalOpen, setIsListingModalOpen] = React.useState(false)

  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gridTemplateColumns: { md: '1fr 400px', xs: '1fr' },
        gap: theme.spacing(5),
        alignItems: 'center',
        minHeight: '500px'
      })}
    >
      <CreateListingModal open={isListingModalOpen} onClose={() => setIsListingModalOpen(false)} nft={nft} />

      <AnimatePresence mode='wait'>
        <motion.div
          key={nft.id.toString()}
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Paper variant='showcaseImage'>
            <Image src={image} alt={name} fill style={{ objectFit: 'cover' }} priority />
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
          </Paper>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Paper variant='gasCard' sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Stack spacing={1}>
            <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
              <Typography variant='h4'>{name}</Typography>
              <StatusBadge status={hasAircraft ? 'success' : 'primary'}>
                {hasAircraft ? 'Propiedad' : 'Disponible'}
              </StatusBadge>
            </Box>
            <Typography variant='body2' color='text.secondary'>
              {description}
            </Typography>
          </Stack>

          <Box mt={1}>
            {specs.map((spec) => {
              if (hasAircraft && spec.trait_type.toLowerCase() === 'price') return null
              return (
                <SpecItem key={spec.trait_type} label={spec.trait_type.replace('_', ' ')}>
                  {spec.trait_type.toLowerCase() === 'license' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {license && (
                        <Image
                          src={license.metadata.image as string}
                          alt={license.metadata.name as string}
                          width={24}
                          height={24}
                          style={{ borderRadius: '4px' }}
                        />
                      )}
                    </Box>
                  ) : (
                    <Typography fontWeight={700} fontSize='0.9rem'>
                      {spec.trait_type.toLowerCase() === 'price' ? `${spec.value} AIRL` : spec.value}
                    </Typography>
                  )}
                </SpecItem>
              )
            })}
          </Box>

          <Button
            variant='premium'
            fullWidth
            onClick={hasAircraft ? () => setIsListingModalOpen(true) : onClaim}
            disabled={!hasAircraft && isClaiming}
            sx={{ mt: 2 }}
          >
            {hasAircraft ? 'Listar en Marketplace' : isClaiming ? 'Procesando...' : `Adquirir por ${price} AIRL`}
          </Button>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default AircraftShowcase
