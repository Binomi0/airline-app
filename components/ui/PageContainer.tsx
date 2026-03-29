import React from 'react'
import { Box, useTheme } from '@mui/material'

interface PageContainerProps {
  children: React.ReactNode
  padding?: number
}

const PageContainer: React.FC<PageContainerProps> = ({ children, padding = 3 }) => {
  const theme = useTheme()

  return (
    <Box
      component='main'
      sx={{
        height: 'calc(100vh - 64px)',
        padding: theme.spacing(padding),
        overflowY: 'auto',
        backgroundColor: theme.palette.background.default,
        position: 'relative'
      }}
    >
      {children}
    </Box>
  )
}

export default PageContainer
