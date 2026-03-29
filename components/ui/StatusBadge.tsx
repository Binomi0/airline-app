import React from 'react'
import { Box, alpha } from '@mui/material'
import { styled } from '@mui/material/styles'

export type StatusType = 'success' | 'error' | 'primary' | 'warning'

interface StatusBadgeProps {
  status?: StatusType
  children: React.ReactNode
  size?: 'small' | 'medium'
}

const BadgeRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status' && prop !== 'size'
})<{ status: StatusType; size: 'small' | 'medium' }>(({ theme, status, size }) => {
  const color = theme.palette[status].main
  return {
    padding: size === 'small' ? '4px 10px' : '6px 12px',
    borderRadius: '8px',
    fontSize: size === 'small' ? '0.65rem' : '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    width: 'fit-content',
    background: alpha(color, 0.1),
    color: color,
    border: `1px solid ${alpha(color, 0.2)}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'primary', children, size = 'medium' }) => {
  return (
    <BadgeRoot status={status} size={size}>
      {children}
    </BadgeRoot>
  )
}

export default StatusBadge
