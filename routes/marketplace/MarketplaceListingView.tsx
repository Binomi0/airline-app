import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import { styled, alpha } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from 'utils'
import MarketplaceHeader from './components/MarketplaceHeader'
import { IMarketplaceListing } from 'models/MarketplaceListing'
import ListingFilters from 'routes/marketplace/components/ListingFilters'
import AircraftListingCard from 'routes/marketplace/components/AircraftListingCard'

const ViewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  paddingBottom: theme.spacing(8)
}))

const ListingsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}))

const ListingsGrid = styled(Box)(({ theme }) => ({
  flexGrow: 1
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

  const filteredListings = listings?.filter((listing: any) =>
    listing.nft?.metadata?.name?.toLowerCase().includes(filters.search.toLowerCase())
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
            <Box display='flex' justifyContent='center' py={10}>
              <CircularProgress color='primary' />
            </Box>
          ) : filteredListings && filteredListings.length > 0 ? (
            <Grid container spacing={3}>
              {filteredListings.map((listing) => (
                <Grid item xs={12} sm={6} lg={4} key={listing._id.toString()}>
                  <AircraftListingCard listing={listing} onPurchaseSuccess={refetch} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign='center' py={10} sx={{ opacity: 0.5 }}>
              <Typography variant='h6'>No se encontraron aeronaves en el mercado</Typography>
              <Typography variant='body2'>Prueba a cambiar los filtros o el tipo de búsqueda</Typography>
            </Box>
          )}
        </ListingsGrid>
      </ListingsSection>
    </ViewContainer>
  )
}

export default MarketplaceListingView
