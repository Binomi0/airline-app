import React from 'react'
import LiveView from 'routes/Live/LiveView'
import Disconnected from 'components/Disconnected'
import { useRouter } from 'next/router'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import LinearProgress from '@mui/material/LinearProgress'
import Container from '@mui/material/Container'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import type { PageProps } from 'types'

const LivePage = ({ loading }: PageProps) => {
  const router = useRouter()
  const user = useRecoilValue(userState)
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

export default LivePage
