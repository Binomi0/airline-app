import { Box, Fade, LinearProgress } from '@mui/material'
import { useContract, useNFT } from '@thirdweb-dev/react'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { VaProvider } from 'context/VaProvider'
import { nftAircraftTokenAddress } from 'contracts/address'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import CargoView from 'routes/Cargo/CargoView'
import Disconnected from 'components/Disconnected'
import useAuth from 'hooks/useAuth'
import useLive from 'hooks/useLive'
import { useAircraftProviderContext } from 'context/AircraftProvider/AircraftProvider.context'

const CargoAircraft: NextPage<{ loading: boolean; NoAddress: React.ReactNode }> = ({ loading }) => {
  const router = useRouter()
  const { user } = useAuth()
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data, isLoading } = useNFT(contract, router.query.aircraft as string)
  const { ownedAircrafts: owned, isLoading: isLoadingOwn } = useAircraftProviderContext()
  const { live } = useLive()

  const hasAircraft = React.useMemo(() => {
    if (!owned || !data) return false
    return owned.some((nft) => nft.metadata.id === data.metadata.id)
  }, [owned, data])

  React.useEffect(() => {
    if (live) router.push('/live')
  }, [live, router])

  React.useEffect(() => {
    if (!user) {
      router.push('/cargo')
    }
  }, [user, router])

  React.useEffect(() => {
    if (!!owned && !!data && !isLoading && !isLoadingOwn && !hasAircraft) {
      router.push('/hangar')
    }
  }, [owned, data, isLoading, isLoadingOwn, router, hasAircraft])

  if (!user) {
    return <Disconnected />
  }

  return (
    <VaProvider>
      <Fade in={isLoading || isLoadingOwn}>
        <Box>
          <LinearProgress />
        </Box>
      </Fade>
      <Fade in={!isLoading && !isLoadingOwn}>
        <Box>{hasAircraft ? <CargoView loading={loading} aircraft={data} /> : null}</Box>
      </Fade>
    </VaProvider>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default CargoAircraft
