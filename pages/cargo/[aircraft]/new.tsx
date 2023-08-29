import { Box, Fade, LinearProgress } from '@mui/material'
import { useContract, useNFT, useOwnedNFTs } from '@thirdweb-dev/react'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { VaProvider } from 'context/VaProvider'
import { nftAircraftTokenAddress } from 'contracts/address'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useMemo } from 'react'
import CargoView from 'routes/Cargo/CargoView'
import Disconnected from 'components/Disconnected'

const CargoAircraft: NextPage<{ loading: boolean; NoAddress: ReactNode }> = ({ loading }) => {
  const router = useRouter()
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data, isLoading } = useNFT(contract, router.query.aircraft as string)
  const { data: owned, isLoading: isLoadingOwn } = useOwnedNFTs(contract, address)

  const hasAircraft = useMemo(() => {
    if (!owned || !data) return false
    return owned.some((nft) => nft.metadata.id === data.metadata.id)
  }, [owned, data])

  useEffect(() => {
    if (!address) {
      router.push('/cargo')
    }
  }, [address, router])

  useEffect(() => {
    if (!!owned && !!data && !isLoading && !isLoadingOwn && !hasAircraft) {
      router.push('/hangar')
    }
  }, [owned, data, isLoading, isLoadingOwn, router, hasAircraft])

  if (!address) {
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
