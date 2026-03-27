import React, { useMemo } from 'react'
import Image from 'next/image'
import { Box, Typography, Button, Stack } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import { motion, AnimatePresence } from 'framer-motion'
import { INft } from 'models/Nft'
import { getNFTAttributes } from 'utils'
import { useNFTProviderContext } from 'context/NFTProvider'
import CreateListingModal from 'routes/marketplace/components/CreateListingModal'

const ShowcaseContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 400px',
  gap: theme.spacing(5),
  alignItems: 'center',
  minHeight: '500px',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(3)
  }
}))

const ImageShowcase = styled(Box)(() => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const MainAircraftImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  aspectRatio: '4 / 3',
  maxWidth: '500px',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: `0 20px 40px -15px ${alpha('#000', 0.5)}, 0 0 30px ${alpha(theme.palette.primary.main, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  background: alpha(theme.palette.background.paper, 0.02),
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  margin: '0 auto',
  '&:hover': {
    transform: 'translateY(-5px) scale(1.02)',
    borderColor: alpha(theme.palette.primary.main, 0.4),
    boxShadow: `0 30px 60px -20px ${alpha('#000', 0.6)}, 0 0 40px ${alpha(theme.palette.primary.main, 0.2)}`
  }
}))

const GlassCard = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.4)
      : alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: '24px',
  padding: theme.spacing(4),
  boxShadow:
    theme.palette.mode === 'dark' ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5)
}))

const SpecRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}))

const SpecLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px'
}))

const SpecValue = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.9rem'
}))

const StatusBadge = styled(Box)<{ owned?: boolean }>(({ theme, owned }) => ({
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  width: 'fit-content',
  background: owned ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.primary.main, 0.1),
  color: owned ? theme.palette.success.main : theme.palette.primary.main,
  border: `1px solid ${alpha(owned ? theme.palette.success.main : theme.palette.primary.main, 0.2)}`
}))

const PremiumButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: '#fff',
  borderRadius: '12px',
  fontWeight: 700,
  textTransform: 'none',
  padding: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
  },
  '&:disabled': {
    opacity: 0.7,
    color: alpha('#fff', 0.5)
  }
}))

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
    <ShowcaseContainer>
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
          <MainAircraftImageContainer>
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
          </MainAircraftImageContainer>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <GlassCard>
          <Stack spacing={1}>
            <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
              <Typography variant='h4' fontWeight={800} sx={{ letterSpacing: '-1px' }}>
                {name}
              </Typography>
              <StatusBadge owned={hasAircraft}>{hasAircraft ? 'Propiedad' : 'Disponible'}</StatusBadge>
            </Box>
            <Typography variant='body2' color='text.secondary'>
              {description}
            </Typography>
          </Stack>

          <Box mt={1}>
            {specs.map((spec) => {
              if (hasAircraft && spec.trait_type.toLowerCase() === 'price') return null
              return (
                <SpecRow key={spec.trait_type}>
                  <SpecLabel>{spec.trait_type.replace('_', ' ')}</SpecLabel>
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
                    <SpecValue>
                      {spec.trait_type.toLowerCase() === 'price' ? `${spec.value} AIRL` : spec.value}
                    </SpecValue>
                  )}
                </SpecRow>
              )
            })}
          </Box>

          <PremiumButton
            fullWidth
            onClick={hasAircraft ? () => setIsListingModalOpen(true) : onClaim}
            disabled={!hasAircraft && isClaiming}
            sx={{ mt: 2 }}
          >
            {hasAircraft ? 'Listar en Marketplace' : isClaiming ? 'Procesando...' : `Adquirir por ${price} AIRL`}
          </PremiumButton>
        </GlassCard>
      </motion.div>
    </ShowcaseContainer>
  )
}

export default AircraftShowcase
