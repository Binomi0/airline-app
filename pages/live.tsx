import React from 'react'
import { Container, LinearProgress } from '@mui/material'
import LiveView from 'routes/Live/LiveView'
import serverSidePropsHandler from 'components/ServerSideHandler'
import Disconnected from 'components/Disconnected'
import { useRouter } from 'next/router'
import useAuth from 'hooks/useAuth'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'

interface Props {
  loading: boolean
}

const LivePage = ({ loading }: Props) => {
  const router = useRouter()
  const { user } = useAuth()
  const { live } = useLiveFlightProviderContext()

  React.useEffect(() => {
    if (live === null) {
      router.push('/')
    }
  }, [live, router])

  if (loading) {
    return <LinearProgress />
  }

  if (!user || live === null) {
    return <Disconnected />
  }

  return live ? (
    <Container>
      <LiveView />
    </Container>
  ) : null
}

export const getServerSideProps = serverSidePropsHandler

export default LivePage
