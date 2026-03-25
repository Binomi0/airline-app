import LiveView from 'routes/Live/LiveView'
import Disconnected from 'components/Disconnected'
import Container from '@mui/material/Container'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import useMission from 'hooks/useMission'
import { useEffect } from 'react'
import NoMissionView from 'routes/Live/components/NoMissionView'
import { useRouter } from 'next/router'

const LivePage = () => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const { mission, getMission, isLoading } = useMission()

  useEffect(() => {
    getMission()
  }, [getMission])

  useEffect(() => {
    if (!mission && !isLoading) {
      // router.push('/missions')
    }
  }, [mission, isLoading, router])

  if (!user) {
    return <Disconnected />
  }

  if (!mission) {
    return <NoMissionView />
  }

  return (
    <Container>
      <LiveView mission={mission} isLoading={isLoading} />
    </Container>
  )
}

export default LivePage
