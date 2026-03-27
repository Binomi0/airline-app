import React, { useCallback, useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import useClaimNFT from 'hooks/useClaimNFT'
import Swal from 'sweetalert2'
import { useTokenProviderContext } from 'context/TokenProvider'
import AircraftItem from './components/AircraftItem'
import AircraftShowcase from './components/AircraftShowcase'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { styled, alpha, useTheme } from '@mui/material/styles'
import { INft } from 'models/Nft'
import { useNFTProviderContext } from 'context/NFTProvider'
import { tokenBalanceStore } from 'store/balance.atom'
import { getNFTAttributes } from 'utils'
import useAircraft from 'hooks/useAircraft'

const PageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: 'calc(100vh - 64px)',
  padding: theme.spacing(0, 3),
  color: theme.palette.text.primary,
  overflowX: 'hidden',
  background: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column'
}))

const BackgroundOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage:
    theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${alpha(theme.palette.slate.dark, 0.95)} 0%, ${alpha(theme.palette.slate.main, 0.9)} 100%), url('/img/airport_bg.png')`
      : `linear-gradient(135deg, ${alpha(theme.palette.slate.light, 0.9)} 0%, ${alpha(theme.palette.slate.main, 0.85)} 100%), url('/img/airport_bg.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 80%)`,
    animation: 'pulse 8s infinite alternate ease-in-out'
  },
  '@keyframes pulse': {
    '0%': { opacity: 0.3, transform: 'scale(1)' },
    '100%': { opacity: 0.7, transform: 'scale(1.1)' }
  }
}))

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: '1400px',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  flex: 1,
  gap: theme.spacing(5),
  padding: theme.spacing(8, 0, 5, 0)
}))

const CarouselSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3)
}))

const CarouselScroll = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  overflowX: 'auto',
  padding: theme.spacing(1, 0.5, 4, 0.5),
  scrollbarWidth: 'thin',
  scrollbarColor: `${alpha(theme.palette.text.primary, 0.1)} transparent`,
  '&::-webkit-scrollbar': {
    height: 6
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha(theme.palette.text.primary, 0.1),
    borderRadius: 10
  }
}))

const HangarView: React.FC = () => {
  const theme = useTheme()
  const { aircrafts, refetch: refetchNFTs } = useNFTProviderContext()
  const { claimAircraftNFT, isClaiming } = useClaimNFT()
  const { getAirlBalance } = useTokenProviderContext()
  const balance = useRecoilValue(tokenBalanceStore)
  const [selectedAircraft, setSelectedAircraft] = useState<INft | null>(null)

  const { hasAircraft } = useAircraft(selectedAircraft?.id as string)

  useEffect(() => {
    if (aircrafts && aircrafts.length > 0 && !selectedAircraft) {
      setSelectedAircraft(aircrafts[0])
    }
  }, [aircrafts, selectedAircraft])

  const handleClaim = useCallback(
    async (aircraftNFT: INft) => {
      if (!balance.airl) return

      const attribute = getNFTAttributes(aircraftNFT).find((attr) => attr.trait_type.toLowerCase() === 'price')
      const { name } = aircraftNFT.metadata

      const hasEnough = balance.airl !== undefined && Number(balance.airl) / 1e18 >= Number(attribute?.value || 0)
      if (!hasEnough) {
        Swal.fire({
          title: name,
          text: `No tienes suficiente AIRL para adquirir esta aeronave`,
          icon: 'error'
        })
        return
      }

      const { isConfirmed } = await Swal.fire({
        title: aircraftNFT.metadata.name as string,
        text: `¿Deseas adquirir esta aeronave?`,
        icon: 'question',
        showCancelButton: true
      })

      if (isConfirmed) {
        try {
          await claimAircraftNFT(aircraftNFT)
          Swal.fire({
            title: aircraftNFT.metadata.name as string,
            text: '¡Aeronave adquirida! ¡Disfruta tus vuelos!',
            icon: 'success'
          })
          refetchNFTs()
          getAirlBalance()
        } catch (err) {
          console.error(err)
        }
      }
    },
    [balance.airl, claimAircraftNFT, getAirlBalance, refetchNFTs]
  )

  if (!aircrafts) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='50vh'>
        <CircularProgress size={60} color='primary' />
      </Box>
    )
  }

  return (
    <PageContainer>
      <BackgroundOverlay />

      <ContentWrapper sx={{ maxWidth: '1400px' }}>
        {/* Header */}
        <Box mb={2}>
          <Typography variant='h3' fontWeight={900} sx={{ letterSpacing: '-2px' }}>
            Tu <span style={{ color: theme.palette.indigo.main }}>Flota</span>
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ maxWidth: '600px', fontWeight: 500 }}>
            Gestiona tus aeronaves y adquiere nuevas unidades para tu carrera.
          </Typography>
        </Box>

        {/* Selected Aircraft Showcase */}
        {selectedAircraft && (
          <AircraftShowcase
            nft={selectedAircraft}
            hasAircraft={hasAircraft}
            isClaiming={isClaiming}
            onClaim={() => handleClaim(selectedAircraft)}
          />
        )}

        {/* Carousel Selector */}
        <CarouselSection>
          <Typography variant='h6' fontWeight={700} sx={{ mb: 2, opacity: 0.9 }}>
            Explorar Aeronaves
          </Typography>
          <CarouselScroll>
            {aircrafts.map((aircraft) => (
              <AircraftItem
                nft={aircraft}
                key={aircraft.id.toString()}
                isActive={selectedAircraft?.id === aircraft.id}
                onClick={() => setSelectedAircraft(aircraft)}
              />
            ))}
          </CarouselScroll>
        </CarouselSection>
      </ContentWrapper>
    </PageContainer>
  )
}

export default HangarView
