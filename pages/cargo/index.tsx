import { useState } from 'react'
import { NextPage } from 'next'
import { NFT, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { nftAircraftTokenAddress } from 'contracts/address'
import CargoView from 'routes/Cargo/CargoView'
import { Box, Container, LinearProgress, Typography } from '@mui/material'
import CargoAircraftSelector from 'routes/Cargo/components/CargoAircraftSelector'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { VaProvider } from 'context/VaProvider'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import Disconnected from 'components/Disconnected'

const CargoPage: NextPage<{ loading: boolean }> = ({ loading }) => {
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const [aircraft, setAircraft] = useState<NFT>()
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data: owned = [], isLoading: isLoadingNFTs, isFetched } = useOwnedNFTs(contract, address)

  console.log({ isLoadingNFTs })
  console.log({ isFetched })
  if (isLoadingNFTs) {
    return <LinearProgress />
  }

  if (!address) {
    return <Disconnected />
  }

  if (owned.length === 0) {
    return (
      <Box>
        <Container>
          <Box mt={10}>
            <Typography>Tienes que tener al menos 1 aeronave para acceder a esta sección.</Typography>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <VaProvider>
      {aircraft ? (
        <CargoView loading={loading} aircraft={aircraft} />
      ) : (
        <CargoAircraftSelector owned={owned} setAircraft={setAircraft} />
      )}
    </VaProvider>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default CargoPage
