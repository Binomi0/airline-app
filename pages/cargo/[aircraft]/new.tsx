import { useReadContract } from 'thirdweb/react'
import { getNFT } from 'thirdweb/extensions/erc721'
import { VaProvider } from 'context/VaProvider'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import CargoView from 'routes/Cargo/CargoView'
import Disconnected from 'components/Disconnected'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import { useAppContracts } from 'hooks/useAppContracts'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { ownedAircraftNftStore } from 'store/aircraftNFT.atom'

const CargoAircraft = () => {
  const router = useRouter()
  const user = useRecoilValue(userState)

  const { aircraftContract: contract } = useAppContracts()

  const { data, isLoading } = useReadContract(getNFT, {
    contract: contract!,
    tokenId: BigInt((router.query.aircraft as string) || 0),
    queryOptions: {
      enabled: !!contract && !!router.query.aircraft
    }
  })

  const ownedAircrafts = useRecoilValue(ownedAircraftNftStore)
  const { live } = useLiveFlightProviderContext()

  const hasAircraft = useMemo(() => {
    if (!ownedAircrafts || !data) return false
    return ownedAircrafts.some((nft) => nft.id.toString() === data.id.toString())
  }, [ownedAircrafts, data])

  React.useEffect(() => {
    if (live) router.push('/live')
  }, [live, router])

  React.useEffect(() => {
    if (!user) {
      router.push('/cargo')
    }
  }, [user, router])

  React.useEffect(() => {
    if (!!ownedAircrafts && !!data && !isLoading && !hasAircraft) {
      router.push('/hangar')
    }
  }, [ownedAircrafts, data, isLoading, router, hasAircraft])

  if (!user) {
    return <Disconnected />
  }

  return (
    <VaProvider>
      <Fade in={isLoading || !ownedAircrafts}>
        <Box>
          <LinearProgress />
        </Box>
      </Fade>
      <Fade in={!isLoading && !!ownedAircrafts}>
        <Box>{hasAircraft ? <CargoView aircraft={data} /> : null}</Box>
      </Fade>
    </VaProvider>
  )
}

export default CargoAircraft
