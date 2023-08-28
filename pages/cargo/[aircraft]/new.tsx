import { Box, Fade, LinearProgress, Typography } from '@mui/material'
import { useContract, useNFT, useOwnedNFTs } from '@thirdweb-dev/react'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { VaProvider } from 'context/VaProvider'
import { nftAircraftTokenAddress } from 'contracts/address'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'
import CargoView from 'routes/Cargo/CargoView'
import GppGoodIcon from '@mui/icons-material/GppGood'

const CargoAircraft: NextPage<{ loading: boolean }> = ({ loading }) => {
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
    return (
      <Box mt={10} textAlign='center'>
        <GppGoodIcon sx={{ fontSize: 72 }} color='primary' />
        <Typography variant='h2' paragraph>
          Sign in
        </Typography>
        <Typography variant='h4' paragraph>
          Sign in with your wallet to checkout available flights.
        </Typography>
      </Box>
    )
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
