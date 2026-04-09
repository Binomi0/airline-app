import React from 'react'
import { Box, Typography, alpha } from '@mui/material'
import { styled } from '@mui/material/styles'

const SpecRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}))

const SpecLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px'
}))

const SpecValue = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: '0.9rem'
}))

interface SpecItemProps {
  label: string
  value?: React.ReactNode
  children?: React.ReactNode
}

const SpecItem: React.FC<SpecItemProps> = ({ label, value, children }) => {
  return (
    <SpecRow>
      <SpecLabel>{label}</SpecLabel>
      {children ? children : <SpecValue>{value}</SpecValue>}
    </SpecRow>
  )
}

export default SpecItem
