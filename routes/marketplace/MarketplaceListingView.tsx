import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import { alpha, styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from 'utils'
import MarketplaceHeader from './components/MarketplaceHeader'
import { IMarketplaceListing } from 'models/MarketplaceListing'
import ListingFilters from 'routes/marketplace/components/ListingFilters'
import AircraftListingCard from 'routes/marketplace/components/AircraftListingCard'
import { INft } from 'models/Nft'

import SearchOffIcon from '@mui/icons-material/SearchOff'

const ViewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(6),
  paddingBottom: theme.spacing(12),
  paddingTop: theme.spacing(4)
}))

const ListingsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(6),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(4)
  }
}))

const ListingsGrid = styled(Box)(() => ({
  flexGrow: 1
}))

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(12, 4),
  borderRadius: '32px',
  background: alpha(theme.palette.background.paper, 0.2),
  backdropFilter: 'blur(10px)',
  border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3)
}))

const MarketplaceListingView: React.FC = () => {
  const [filters, setFilters] = useState({
    type: 'SALE',
    search: ''
  })

  const {
    data: listings,
    isLoading,
    refetch
  } = useQuery<IMarketplaceListing[]>({
    queryKey: ['marketplace-listings', filters.type],
    queryFn: () => fetcher(`/api/marketplace?type=${filters.type}`)
  })

  const filteredListings = listings?.filter((listing: IMarketplaceListing) =>
    (listing.nft as INft)?.metadata?.name?.toLowerCase().includes(filters.search.toLowerCase())
  )

  return (
    <ViewContainer>
      <MarketplaceHeader totalListings={listings?.length || 0} />

      <ListingsSection>
        <ListingFilters
          currentType={filters.type}
          onTypeChange={(type) => setFilters((prev) => ({ ...prev, type }))}
          onSearchChange={(search) => setFilters((prev) => ({ ...prev, search }))}
        />

        <ListingsGrid>
          {isLoading ? (
            <Box display='flex' justifyContent='center' py={20}>
              <CircularProgress color='primary' thickness={5} size={60} />
            </Box>
          ) : filteredListings && filteredListings.length > 0 ? (
            <Grid container spacing={4}>
              {filteredListings.map((listing) => (
                <Grid item xs={12} sm={6} lg={4} key={listing._id.toString()}>
                  <AircraftListingCard listing={listing} onPurchaseSuccess={refetch} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <EmptyState>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  mb: 1
                }}
              >
                <SearchOffIcon sx={{ fontSize: 40 }} />
              </Box>
              <Box>
                <Typography variant='h5' fontWeight={900} gutterBottom>
                  No se encontraron aeronaves
                </Typography>
                <Typography variant='body1' color='text.secondary' sx={{ maxWidth: 400, mx: 'auto' }}>
                  No hay aeronaves que coincidan con tus criterios de búsqueda. Prueba a cambiar los filtros o el tipo
                  de búsqueda.
                </Typography>
              </Box>
            </EmptyState>
          )}
        </ListingsGrid>
      </ListingsSection>
    </ViewContainer>
  )
}

export default MarketplaceListingView
