import { MenuItemProps, Paper, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'

interface Props extends MenuItemProps {
  children: ReactNode
  angle?: string
  from?: string
  to?: string
  border?: string
}

const GradientCard = ({
  children,
  angle = '45deg',
  from = 'rgba(255,255,255,0.95)',
  to = 'rgba(255,255,255,0.75)',
  border,
  ...rest
}: Props) => {
  const { palette } = useTheme()

  return (
    <Paper
      sx={{
        ...rest.sx,
        background: `linear-gradient(${angle}, ${from}, ${to})`,
        border: border ? border : `2px solid ${palette.primary.dark}`
      }}
    >
      {children}
    </Paper>
  )
}

export default GradientCard
