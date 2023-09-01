import React from 'react'
import { Container, LinearProgress } from '@mui/material'
import { VaProvider } from 'context/VaProvider'
import LiveView from 'routes/Live/LiveView'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { useAuthProviderContext } from 'context/AuthProvider'
import Disconnected from 'components/Disconnected'

interface Props {
  loading: boolean
}

const LivePage = ({ loading }: Props) => {
  const { user } = useAuthProviderContext()

  if (loading) {
    return <LinearProgress />
  }

  if (!user) {
    return <Disconnected />
  }

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
