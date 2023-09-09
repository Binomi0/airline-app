import React from 'react'
import { Box, Container, LinearProgress, Typography } from '@mui/material'
import { VaProvider } from '../context/VaProvider'
import IvaoView from 'routes/Ivao/IvaoView'
import { useAuthProviderContext } from 'context/AuthProvider'
import Disconnected from 'components/Disconnected'
import serverSidePropsHandler from 'components/ServerSideHandler'

interface Props {
  loading: boolean
}

const IVAOPage = ({ loading }: Props) => {

  console.log({loading})
  const { user } = useAuthProviderContext()

  if (loading) return <LinearProgress />
  if (!user) return <Disconnected />


  return (
    <VaProvider>
      <Container>
        <Box mt={10}>
          <Typography textTransform='uppercase' letterSpacing={-0.6} fontFamily='B612 Mono' paragraph textAlign='center' variant='h1'>
            IVAO Active Flights
          </Typography>
          <IvaoView />
        </Box>
      </Container>
    </VaProvider>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default IVAOPage
