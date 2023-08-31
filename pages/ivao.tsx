import React from 'react'
import { Box, Container, Typography } from '@mui/material'
import { VaProvider } from '../context/VaProvider'
import IvaoView from 'routes/Ivao/IvaoView'
import { useAuthProviderContext } from 'context/AuthProvider'
import Disconnected from 'components/Disconnected'

const IVAOPage = () => {
  const { user } = useAuthProviderContext()

  if (!user) {
    return <Disconnected />
  }

  return (
    <VaProvider>
      <Container>
        <Box mt={10}>
          <Typography paragraph textAlign='center' variant='h1'>
            IVAO ES Active Flights
          </Typography>
          <IvaoView />
        </Box>
      </Container>
    </VaProvider>
  )
}

export default IVAOPage
