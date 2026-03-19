import React, { useCallback, useState, useEffect } from 'react'
import LicenseShowcase from './components/LicenseShowcase'
import LicenseItemThumbnail from './components/LicenseItemThumbnail'
import useClaimNFT from 'hooks/useClaimNFT'
import { useTokenProviderContext } from 'context/TokenProvider'
import Swal from 'sweetalert2'
import { getNFTAttributes } from 'utils'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useRecoilValue } from 'recoil'
import { tokenBalanceStore } from 'store/balance.atom'
import { useNFTProviderContext } from 'context/NFTProvider'
import { INft } from 'models/Nft'
import useOwnedNfts from 'hooks/useOwnedNFTs'
import styles from 'styles/License.module.css'

const LicenseView: React.FC = () => {
  const { licenses } = useNFTProviderContext()
  const { data: ownedLicenses } = useOwnedNfts()
  const { claimLicenseNFT, isClaiming } = useClaimNFT()
  const { getAirlBalance } = useTokenProviderContext()
  const balance = useRecoilValue(tokenBalanceStore)
  
  const [selectedLicense, setSelectedLicense] = useState<INft | null>(null)

  useEffect(() => {
    if (licenses && licenses.length > 0 && !selectedLicense) {
      setSelectedLicense(licenses[0])
    }
  }, [licenses, selectedLicense])

  const handleClaim = useCallback(
    async (nft: INft) => {
      if (!balance.airl) return

      const attribute = getNFTAttributes(nft).find((attr) => attr.trait_type === 'price')
      const { name } = nft.metadata

      const hasEnough = balance.airl !== undefined && Number(balance.airl) / 1e18 >= Number(attribute?.value || 0)
      
      if (hasEnough) {
        const { isConfirmed } = await Swal.fire({
          title: name as string,
          text: `¿Quieres adquirir esta licencia por ${attribute?.value} AIRL?`,
          icon: 'question',
          showCancelButton: true
        })

        if (isConfirmed) {
          try {
            await claimLicenseNFT(nft)
            Swal.fire({
              title: name as string,
              text: '¡Licencia adquirida! Ahora tienes acceso a nuevas aeronaves.',
              icon: 'success'
            })
            await getAirlBalance()
          } catch (err) {
            console.error(err)
          }
        }
      } else {
        Swal.fire({
          title: 'Tokens insuficientes',
          text: `Necesitas al menos ${attribute?.value} AIRL para adquirir esta licencia.`,
          icon: 'error'
        })
      }
    },
    [balance.airl, claimLicenseNFT, getAirlBalance]
  )

  if (!licenses) {
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
        {/* Header Section */}
        <Box mb={2}>
          <Typography variant='h3' fontWeight={800} sx={{ letterSpacing: '-1px' }}>
            Tus <span style={{ color: '#6366f1' }}>Licencias</span>
          </Typography>
          <Typography variant='h6' color='rgba(255,255,255,0.5)'>
            Progresa en tu carrera aeronáutica desbloqueando nuevos rangos y aeronaves.
          </Typography>
        </Box>

        {/* Selected License Showcase */}
        {selectedLicense && (
          <LicenseShowcase
            nft={selectedLicense}
            isClaiming={isClaiming}
            owned={ownedLicenses?.some((n) => BigInt(selectedLicense.id) === BigInt(n.tokenId)) ?? false}
            onClaim={() => handleClaim(selectedLicense)}
          />
        )}

        {/* Carousel Selector */}
        <Box className={styles.carouselSection}>
          <Typography className={styles.carouselTitle}>Explorar Rangos</Typography>
          <Box className={styles.carouselScroll}>
            {licenses.map((license) => (
              <LicenseItemThumbnail
                key={license.id.toString()}
                nft={license}
                isActive={selectedLicense?.id === license.id}
                onClick={() => setSelectedLicense(license)}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LicenseView
