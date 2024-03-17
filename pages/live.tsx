import React from 'react'
import LiveView from 'routes/Live/LiveView'
import serverSidePropsHandler from 'components/ServerSideHandler'
import Disconnected from 'components/Disconnected'
import { useRouter } from 'next/router'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import LinearProgress from '@mui/material/LinearProgress'
import Container from '@mui/material/Container'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'

interface Props {
  loading: boolean
}

const LivePage = ({ loading }: Props) => {
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

export const getServerSideProps = serverSidePropsHandler

export default LivePage
