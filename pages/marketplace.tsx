import MarketplaceListingView from 'routes/marketplace/MarketplaceListingView'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { styled, alpha } from '@mui/material/styles'

const PageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: 'calc(100vh - 64px)',
  padding: theme.spacing(6, 0),
  color: theme.palette.text.primary,
  overflowX: 'hidden',
  background: theme.palette.background.default
}))

const BackgroundOverlay = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage:
    theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${alpha('#0f172a', 0.95)} 0%, ${alpha('#1e293b', 0.85)} 100%), url('/img/airport_bg.png')`
      : `linear-gradient(135deg, ${alpha('#f8fafc', 0.8)} 0%, ${alpha('#cbd5e1', 0.6)} 100%), url('/img/airport_bg.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0
}))

const Marketplace = () => {
  return (
    <PageWrapper>
      <BackgroundOverlay />
      <Container maxWidth='xl' sx={{ position: 'relative', zIndex: 1 }}>
        <MarketplaceListingView />
      </Container>
    </PageWrapper>
  )
}

export default Marketplace
