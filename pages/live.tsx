import LiveView from 'routes/Live/LiveView'
import Disconnected from 'components/Disconnected'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import Container from '@mui/material/Container'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'

const LivePage = () => {
  const user = useRecoilValue(userState)
  const { live } = useLiveFlightProviderContext()

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
