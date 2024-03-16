import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import React from 'react'

const NoAddress = () => {
  const { smartAccountAddress: address } = useAlchemyProviderContext()

  return (
    <Fade in={!address} unmountOnExit>
      <Box textAlign='center'>
        <Typography variant='h4'>Conecta tu wallet para selecionar un vuelo.</Typography>
      </Box>
    </Fade>
  )
}

export default NoAddress
