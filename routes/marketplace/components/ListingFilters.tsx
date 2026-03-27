import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Paper from '@mui/material/Paper'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { styled, alpha } from '@mui/material/styles'

const FiltersContainer = styled(Paper)(({ theme }) => ({
  width: '300px',
  flexShrink: 0,
  padding: theme.spacing(3),
  height: 'fit-content',
  position: 'sticky',
  top: theme.spacing(2),
  background:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.4)
      : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: '24px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    position: 'static'
  }
}))

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4)
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 40,
  '& .MuiTabs-indicator': {
    height: '100%',
    borderRadius: '12px',
    zIndex: 0,
    background: alpha(theme.palette.primary.main, 0.1),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
  }
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 40,
  zIndex: 1,
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main
  }
}))

interface ListingFiltersProps {
  currentType: string
  onTypeChange: (type: string) => void
  onSearchChange: (search: string) => void
}

const ListingFilters: React.FC<ListingFiltersProps> = ({ currentType, onTypeChange, onSearchChange }) => {
  return (
    <FiltersContainer elevation={0}>
      <Section>
        <Typography
          variant='subtitle2'
          fontWeight={800}
          mb={2}
          color='primary.main'
          sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
        >
          Búsqueda
        </Typography>
        <TextField
          fullWidth
          placeholder='Buscar aeronave...'
          variant='outlined'
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '12px',
              bgcolor: (theme) => alpha(theme.palette.background.default, 0.5)
            }
          }}
        />
      </Section>

      <Section>
        <Typography
          variant='subtitle2'
          fontWeight={800}
          mb={2}
          color='primary.main'
          sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
        >
          Categoría
        </Typography>
        <StyledTabs value={currentType} onChange={(_, val) => onTypeChange(val)} variant='fullWidth'>
          <StyledTab label='Compra' value='SALE' />
          <StyledTab label='Alquiler' value='RENT' />
        </StyledTabs>
      </Section>

      <Section>
        <Typography
          variant='subtitle2'
          fontWeight={800}
          mb={2}
          color='primary.main'
          sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
        >
          Estado
        </Typography>
        <Box display='flex' flexDirection='column' gap={1}>
          <Typography variant='body2' sx={{ opacity: 0.6, cursor: 'not-allowed' }}>
            Próximamente: Historial de precios
          </Typography>
          <Typography variant='body2' sx={{ opacity: 0.6, cursor: 'not-allowed' }}>
            Próximamente: Ranking de rareza
          </Typography>
        </Box>
      </Section>
    </FiltersContainer>
  )
}

export default ListingFilters
