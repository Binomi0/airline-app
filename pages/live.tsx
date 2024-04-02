import React from 'react'
import LiveView from 'routes/Live/LiveView'
import Disconnected from 'components/Disconnected'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import LinearProgress from '@mui/material/LinearProgress'
import Container from '@mui/material/Container'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import type { PageProps } from 'types'

const LivePage = ({ loading }: PageProps) => {
  const user = useRecoilValue(userState)
  const { live } = useLiveFlightProviderContext()

  if (loading) {
    return <LinearProgress />
  }

  if (!user) {
    return <Disconnected />
  }

  if (live === null) {
    return <div>No flight plan</div>
  }

  return live ? (
    <Container>
      <LiveView />
    </Container>
  ) : null
}

export default LivePage
