import { useRouter } from 'next/router'
import React from 'react'
import MissionView from 'routes/Missions/MissionView'
import Disconnected from 'components/Disconnected'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { filterByTokenAddress } from 'utils'
import { nftAircraftTokenAddress } from 'contracts/address'
import useOwnedNfts from 'hooks/useOwnedNFTs'

const MissionAircraftPage = () => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const { data: userNfts } = useOwnedNfts()
  const ownedAircrafts = userNfts?.filter(filterByTokenAddress(nftAircraftTokenAddress))
  const { live } = useLiveFlightProviderContext()

  React.useEffect(() => {
    if (live) router.push('/live')
  }, [live, router])

  React.useEffect(() => {
    if (!user) {
      router.push('/missions')
    }
  }, [user, router])

  React.useEffect(() => {
    if (!ownedAircrafts) {
      router.push('/hangar')
    }
  }, [ownedAircrafts, router])

  if (!user) {
    return <Disconnected />
  }

  return (
    <>
      <Fade in={!ownedAircrafts}>
        <Box>
          <LinearProgress />
        </Box>
      </Fade>
      <Fade in={!!ownedAircrafts}>
        <Box>
          <MissionView aircraft={ownedAircrafts?.find((a) => a.tokenId.toString() === router.query.aircraft)?.nft} />
        </Box>
      </Fade>
    </>
  )
}

export default MissionAircraftPage
