import React from 'react'
import { Container, LinearProgress } from '@mui/material'
import { VaProvider } from 'context/VaProvider'
import LiveView from 'routes/Live/LiveView'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { useAuthProviderContext } from 'context/AuthProvider'
import Disconnected from 'components/Disconnected'
import { useRouter } from 'next/router'
import useLive from 'hooks/useLive'

interface Props {
  loading: boolean
}

const LivePage = ({ loading }: Props) => {
  const router = useRouter()
  const { user } = useAuthProviderContext()
  const { live } = useLive()

  React.useEffect(() => {
    if (live === null) {
      router.push('/')
    }
  }, [live, router])

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
