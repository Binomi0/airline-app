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
import { INft } from 'models/Nft'
import { useNFTProviderContext } from 'context/NFTProvider'
import { tokenBalanceStore } from 'store/balance.atom'
import { getNFTAttributes } from 'utils'
import useAircraft from 'hooks/useAircraft'
import styles from 'styles/Hangar.module.css'

const HangarView: React.FC = () => {
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
          text: `You don't have enough AIRL to get this aircraft`,
          icon: 'error'
        })
        return
      }

      const { isConfirmed } = await Swal.fire({
        title: aircraftNFT.metadata.name as string,
        text: `Do you want to get this aircraft?`,
        icon: 'question',
        showCancelButton: true
      })

      if (isConfirmed) {
        try {
          await claimAircraftNFT(aircraftNFT)
          Swal.fire({
            title: aircraftNFT.metadata.name as string,
            text: 'Claimed Aircraft! Enjoy your flights!',
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
    <Box className={styles.pageContainer}>
      <div className={styles.backgroundOverlay} />

      <Box className={styles.contentWrapper}>
        {/* Header */}
        <Box mb={2}>
          <Typography variant='h3' fontWeight={800} sx={{ letterSpacing: '-1px' }}>
            Tu <span style={{ color: '#6366f1' }}>Flota</span>
          </Typography>
          <Typography variant='h6' color='rgba(255,255,255,0.5)'>
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
        <Box className={styles.carouselSection}>
          <Typography className={styles.carouselTitle}>Explorar Aeronaves</Typography>
          <Box className={styles.carouselScroll}>
            {aircrafts.map((aircraft) => (
              <AircraftItem
                nft={aircraft}
                key={aircraft.id.toString()}
                isActive={selectedAircraft?.id === aircraft.id}
                onClick={() => setSelectedAircraft(aircraft)}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default HangarView
