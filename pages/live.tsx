import LiveView from 'routes/Live/LiveView'
import Disconnected from 'components/Disconnected'
import Container from '@mui/material/Container'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import useMission from 'hooks/useMission'
import { useEffect } from 'react'
import NoMissionView from 'routes/Live/components/NoMissionView'

const LivePage = () => {
  const user = useRecoilValue(userState)
  const { mission, getMission, isLoading } = useMission()

  useEffect(() => {
    getMission()
  }, [getMission])

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
