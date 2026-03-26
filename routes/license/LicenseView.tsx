import React, { useState, useEffect } from 'react'
import LicenseShowcase from './components/LicenseShowcase'
import LicenseItemThumbnail from './components/LicenseItemThumbnail'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { LICENSES, License } from 'config/licenses'
import usePilotProgress from 'hooks/usePilotProgress'
import styles from 'styles/License.module.css'

const LicenseView: React.FC = () => {
  const { unlockedLicenses, totalHours, progressToNext, nextLicense } = usePilotProgress()
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null)

  useEffect(() => {
    if (LICENSES.length > 0 && !selectedLicense) {
      setSelectedLicense(LICENSES[0])
    }
  }, [selectedLicense])

  if (!LICENSES) {
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
        <Box mb={6}>
          <Typography variant='h3' fontWeight={900} sx={{ letterSpacing: '-2px', mb: 1 }}>
            Tu <span style={{ color: '#6366f1' }}>Carrera Piloto</span>
          </Typography>
          <Typography variant='body1' sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: '600px' }}>
            Has acumulado <strong>{totalHours.toFixed(1)} horas</strong> de vuelo. 
            {nextLicense ? (
              ` Te faltan ${(nextLicense.minHours - totalHours).toFixed(1)} horas para tu próxima licencia.`
            ) : (
              ' ¡Has alcanzado el rango máximo de la aviación comercial!'
            )}
          </Typography>
        </Box>

        {/* Selected License Showcase */}
        {selectedLicense && (
          <LicenseShowcase
            license={selectedLicense}
            isUnlocked={unlockedLicenses.includes(selectedLicense.id)}
            totalHours={totalHours}
            progressToNext={selectedLicense.id === nextLicense?.id ? progressToNext : 0}
          />
        )}

        {/* Carousel Selector */}
        <Box className={styles.carouselSection}>
          <Typography className={styles.carouselTitle}>Progreso de Licencias</Typography>
          <Box className={styles.carouselScroll}>
            {LICENSES.map((license) => (
              <LicenseItemThumbnail
                key={license.id}
                license={license}
                isActive={selectedLicense?.id === license.id}
                isUnlocked={unlockedLicenses.includes(license.id)}
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
