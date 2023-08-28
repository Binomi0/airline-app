import React from 'react'
import { Container } from '@mui/material'
import { VaProvider } from 'context/VaProvider'
import LiveView from 'routes/Live/LiveView'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { useAuthProviderContext } from 'context/AuthProvider'

const LivePage = () => {
  const { user } = useAuthProviderContext()
  return user ? (
    <VaProvider>
      <Container>
        <LiveView />
      </Container>
    </VaProvider>
  ) : null
}

export const getServerSideProps = serverSidePropsHandler

export default LivePage
