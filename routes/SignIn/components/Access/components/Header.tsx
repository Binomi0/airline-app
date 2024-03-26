import Box from '@mui/material/Box/Box'
import Stack from '@mui/material/Stack/Stack'
import Image from '@mui/icons-material/Image'
import Typography from '@mui/material/Typography'

import React from 'react'

const Header: React.FC = () => {
  return (
    <Box textAlign="center">
      <Image fontSize="large" />
      <Stack direction="row" spacing={1}>
        <Typography align="center" fontWeight={700} variant="h3">
          Welcome to WeiFly!
        </Typography>
      </Stack>
    </Box>
  )
}

export default Header
