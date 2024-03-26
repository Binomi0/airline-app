import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'

const NoAddress = () => {
  const address = useRecoilValue(smartAccountAddressStore)

  return (
    <Fade in={!address} unmountOnExit>
      <Box textAlign='center'>
        <Typography variant='h4'>Conecta tu wallet para selecionar un vuelo.</Typography>
      </Box>
    </Fade>
  )
}

export default NoAddress
