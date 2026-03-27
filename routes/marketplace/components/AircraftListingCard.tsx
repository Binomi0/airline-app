import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { styled, alpha } from '@mui/material/styles'
import { IMarketplaceListing } from 'models/MarketplaceListing'
import { formatNumber, getNFTAttributes } from 'utils'
import Swal from 'sweetalert2'
import axios, { AxiosError } from 'axios'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import FlightIcon from '@mui/icons-material/Flight'
import PersonIcon from '@mui/icons-material/Person'
import SpeedIcon from '@mui/icons-material/Speed'
import { INft } from 'models/Nft'
import { IUser } from 'models/User'

const Card = styled(Paper)(({ theme }) => ({
  borderRadius: '24px',
  background:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.4)
      : alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: theme.palette.primary.main
  }
}))

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '60%',
  overflow: 'hidden',
  background: theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.grey[100],
  '& img': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease'
  },
  '&:hover img': {
    transform: 'scale(1.05)'
  }
}))

const Content = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}))

const PriceTag = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 20px',
  borderRadius: '16px',
  background: alpha(theme.palette.primary.main, 0.08),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
}))

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  '& svg': {
    fontSize: 18,
    color: theme.palette.primary.main
  }
}))

interface AircraftListingCardProps {
  listing: IMarketplaceListing
  onPurchaseSuccess: () => void
}

const AircraftListingCard: React.FC<AircraftListingCardProps> = ({ listing, onPurchaseSuccess }) => {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const nft = listing.nft as INft
  const attributes = getNFTAttributes(nft)

  const licenseType = attributes.find((a) => a.trait_type === 'license')?.value || 'N/A'
  const speed = attributes.find((a) => a.trait_type === 'cruise_speed')?.value || 'N/A'
  const range = attributes.find((a) => a.trait_type === 'range_max')?.value || 'N/A'
  const pax = attributes.find((a) => a.trait_type === 'pax_max')?.value || 'N/A'

  const handleBuy = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Confirmar Adquisición',
      text: `¿Deseas comprar esta ${nft.metadata.name} por ${formatNumber(Number(listing.price))} ${listing.currency}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    })

    if (isConfirmed) {
      setIsPurchasing(true)
      try {
        await axios.post('/api/marketplace/buy', { listingId: listing._id })
        Swal.fire('¡Éxito!', 'La aeronave ha sido transferida a tu hangar.', 'success')
        onPurchaseSuccess()
      } catch (error: unknown) {
        const err = error as AxiosError<{ error?: string }>
        Swal.fire('Error', err.response?.data?.error || 'No se pudo completar la compra', 'error')
      } finally {
        setIsPurchasing(false)
      }
    }
  }

  return (
    <Card elevation={0}>
      <ImageContainer>
        <img src={nft.metadata.image} alt={nft.metadata.name as string} />
        <Chip
          label={listing.type === 'SALE' ? 'VENTA' : 'ALQUILER'}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            fontWeight: 800,
            background: (theme) => alpha(theme.palette.common.black, 0.6),
            color: 'common.white',
            backdropFilter: 'blur(4px)',
            border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.2)}`
          }}
        />
      </ImageContainer>

      <Content>
        <Box>
          <Typography variant='h5' fontWeight={800} gutterBottom>
            {nft.metadata.name}
          </Typography>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}
          >
            Vendedor: {(listing.seller as IUser)?.email.split('@')[0]}
          </Typography>
        </Box>

        <Divider sx={{ opacity: 0.1 }} />

        <Box display='grid' gridTemplateColumns='1fr 1fr' gap={2}>
          <StatItem>
            <FlightIcon />
            <Typography variant='body2' fontWeight={600}>
              Licencia {licenseType}
            </Typography>
          </StatItem>
          <StatItem>
            <SpeedIcon />
            <Typography variant='body2' fontWeight={600}>
              {speed} kts
            </Typography>
          </StatItem>
          <StatItem>
            <PersonIcon />
            <Typography variant='body2' fontWeight={600}>
              {pax} Pax
            </Typography>
          </StatItem>
          <StatItem>
            <LocalGasStationIcon />
            <Typography variant='body2' fontWeight={600}>
              {range} nm
            </Typography>
          </StatItem>
        </Box>

        <Box mt={2}>
          <PriceTag>
            <Box flexGrow={1}>
              <Typography variant='caption' color='text.secondary' fontWeight={700}>
                PRECIO ACTUAL
              </Typography>
              <Typography variant='h4' fontWeight={900} color='primary.main'>
                {formatNumber(Number(listing.price))}{' '}
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>{listing.currency}</span>
              </Typography>
            </Box>
            <Button variant='premium' onClick={handleBuy} disabled={isPurchasing} sx={{ py: 1.5, px: 3 }}>
              {isPurchasing ? 'Procesando...' : listing.type === 'SALE' ? 'Comprar' : 'Alquilar'}
            </Button>
          </PriceTag>
        </Box>
      </Content>
    </Card>
  )
}

export default AircraftListingCard
