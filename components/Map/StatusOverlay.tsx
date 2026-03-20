import React from 'react'
import { Box, Typography, alpha } from '@mui/material'

const StatusOverlay: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 30,
        left: 30,
        zIndex: 1000,
        bgcolor: alpha('#0f172a', 0.8),
        color: '#38bdf8',
        px: 2,
        py: 1,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        border: '1px solid rgba(56, 189, 248, 0.3)',
        fontFamily: 'monospace'
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          bgcolor: '#38bdf8',
          borderRadius: '50%',
          animation: 'radar-blink 1s infinite'
        }}
      />
      <Typography variant='caption' fontWeight={700} sx={{ letterSpacing: 1 }}>
        WAITING FOR TARGET INPUT...
      </Typography>
    </Box>
  )
}

export default StatusOverlay
