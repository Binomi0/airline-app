import React from 'react'
import { Container } from '@mui/material'
import { VaProvider } from 'context/VaProvider'
import LiveView from 'routes/Live/LiveView'
import serverSidePropsHandler from 'components/ServerSideHandler'

const LivePage = () => {
  return (
    <VaProvider>
      <Container>
        <LiveView />
      </Container>
    </VaProvider>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default LivePage
