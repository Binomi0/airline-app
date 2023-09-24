import React from 'react'
import { Container, LinearProgress } from '@mui/material'
import { VaProvider } from 'context/VaProvider'
import LiveView from 'routes/Live/LiveView'
import serverSidePropsHandler from 'components/ServerSideHandler'
import Disconnected from 'components/Disconnected'
import { useRouter } from 'next/router'
import useLive from 'hooks/useLive'
import useAuth from 'hooks/useAuth'

interface Props {
  loading: boolean
}

const LivePage = ({ loading }: Props) => {
  const router = useRouter()
  const { user } = useAuth()
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
