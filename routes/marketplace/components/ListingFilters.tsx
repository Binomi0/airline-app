import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Paper from '@mui/material/Paper'
import SearchIcon from '@mui/icons-material/Search'
import { styled, alpha } from '@mui/material/styles'

const FiltersContainer = styled(Paper)(({ theme }) => ({
  width: '300px',
  flexShrink: 0,
  padding: theme.spacing(3),
  height: 'fit-content',
  position: 'sticky',
  top: theme.spacing(4),
  background:
    theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.common.white, 0.6),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: '24px',
  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.1)}`,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    position: 'static'
  }
}))

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '&:last-child': {
    marginBottom: 0
  }
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 48,
  background: alpha(theme.palette.text.primary, 0.03),
  borderRadius: '16px',
  padding: '4px',
  '& .MuiTabs-indicator': {
    height: '100%',
    borderRadius: '12px',
    zIndex: 0,
    background: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.primary.main,
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
  }
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 40,
  zIndex: 1,
  fontWeight: 800,
  textTransform: 'none',
  fontSize: '0.875rem',
  borderRadius: '12px',
  transition: 'all 0.2s ease',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white
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
          variant='subtitle1'
          fontWeight={900}
          mb={2}
          color='text.primary'
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <SearchIcon sx={{ fontSize: 20, color: 'primary.main' }} />
          BÚSQUEDA
        </Typography>
        <TextField
          fullWidth
          placeholder='Buscar aeronave...'
          variant='outlined'
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: '16px',
              bgcolor: (theme) => alpha(theme.palette.background.default, 0.5),
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
                borderColor: 'primary.main'
              },
              '&.Mui-focused': {
                bgcolor: (theme) => theme.palette.background.default,
                borderColor: 'primary.main',
                boxShadow: (theme) => `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`
              },
              '& fieldset': { border: 'none' }
            }
          }}
        />
      </Section>

      <Section>
        <Typography variant='subtitle1' fontWeight={900} mb={2} color='text.primary'>
          CATEGORÍA
        </Typography>
        <StyledTabs
          value={currentType}
          onChange={(_, val) => onTypeChange(val)}
          variant='fullWidth'
          TabIndicatorProps={{ style: { display: 'block' } }}
        >
          <StyledTab label='Venta' value='SALE' />
          <StyledTab label='Alquiler' value='RENT' />
        </StyledTabs>
      </Section>

      <Section>
        <Typography variant='subtitle1' fontWeight={900} mb={2} color='text.primary'>
          ESTADO
        </Typography>
        <Box display='flex' flexDirection='column' gap={1.5}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              opacity: 0.5,
              cursor: 'not-allowed',
              p: 1.5,
              borderRadius: '12px',
              border: (theme) => `1px dashed ${alpha(theme.palette.divider, 0.2)}`
            }}
          >
            <Typography variant='body2' fontWeight={600}>
              Historial de precios
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              opacity: 0.5,
              cursor: 'not-allowed',
              p: 1.5,
              borderRadius: '12px',
              border: (theme) => `1px dashed ${alpha(theme.palette.divider, 0.2)}`
            }}
          >
            <Typography variant='body2' fontWeight={600}>
              Ranking de rareza
            </Typography>
          </Box>
        </Box>
      </Section>
    </FiltersContainer>
  )
}

export default ListingFilters
