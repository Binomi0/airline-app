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
      ? `linear-gradient(135deg, ${alpha(theme.palette.slate.dark, 0.98)} 0%, ${alpha(theme.palette.slate.main, 0.92)} 100%), url('/img/airport_bg.png')`
      : `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.94)} 0%, ${alpha(theme.palette.background.paper, 0.85)} 100%), url('/img/airport_bg.png')`,
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
    background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 80%)`,
    pointerEvents: 'none'
  }
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
