import React from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: '12px 16px'
}))

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': { border: 0 }
}))

const incomeSources = [
  { name: 'Royalties NFTs', value: '5%', description: 'Transferencias secundarias de licencias y aviones' },
  { name: 'Fee de Recompensas', value: '5-15%', description: 'Porcentaje de cada recompensa generada por usuarios' },
  { name: 'Fees de Pool Inicial', value: 'Variable', description: 'Comisiones del pool WEIFLY/ETH' }
]

const allocation = [
  { concept: 'Desarrollo', percentage: 30, color: 'info.main' },
  { concept: 'Marketing y Crecimiento', percentage: 20, color: 'success.main' },
  { concept: 'Seguridad y Auditorías', percentage: 20, color: 'warning.main' },
  { concept: 'Tesorería (Reserva)', percentage: 20, color: 'purple.main' },
  { concept: 'Recompensas Comunitarias', percentage: 10, color: 'error.main' }
]

const IncomeDistribution = () => {
  return (
    <Box>
      <Typography variant='subtitle1' gutterBottom fontWeight='bold' color='primary'>
        Fuentes de Ingresos (100% a Tesorería)
      </Typography>
      <TableContainer component={Box} sx={{ mb: 4 }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>Fuente</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold' }} align='right'>
                Porcentaje
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomeSources.map((source) => (
              <StyledTableRow key={source.name}>
                <StyledTableCell>
                  <Typography variant='body2' fontWeight='bold'>
                    {source.name}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {source.description}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align='right'>
                  <Typography variant='body2' fontWeight='bold' color='secondary'>
                    {source.value}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant='subtitle1' gutterBottom fontWeight='bold' color='primary' mt={4}>
        Distribución de Tesorería (Propuesta)
      </Typography>
      <Box sx={{ mt: 2 }}>
        {allocation.map((item) => (
          <Box key={item.concept} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant='body2' fontWeight='medium'>
                {item.concept}
              </Typography>
              <Typography variant='body2' fontWeight='bold'>
                {item.percentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant='determinate'
              value={item.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: item.color,
                  borderRadius: 4
                }
              }}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: (theme) => alpha(theme.palette.common.white, 0.05), borderRadius: 2 }}>
        <Typography variant='caption' display='block' fontStyle='italic'>
          * El capital personal del fundador nunca entra a la tesorería comunitaria. Los ingresos provienen
          exclusivamente de la actividad del protocolo.
        </Typography>
      </Box>
    </Box>
  )
}

export default IncomeDistribution
