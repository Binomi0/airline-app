import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { ConnectWallet, NFT, useAddress, useContract, useOwnedNFTs, useUser, useLogout } from '@thirdweb-dev/react'
import { nftAircraftTokenAddress } from 'contracts/address'
import CargoView from 'routes/Cargo/CargoView'
import { Box, Container, LinearProgress, Typography } from '@mui/material'
import CargoAircraftSelector from 'routes/Cargo/components/CargoAircraftSelector'
import serverSidePropsHandler from 'components/ServerSideHandler'
import GppGoodIcon from '@mui/icons-material/GppGood'
import { VaProvider } from 'context/VaProvider'

const CargoPage: NextPage<{ loading: boolean }> = ({ loading }) => {
  const address = useAddress()
  const { logout } = useLogout()
  const [aircraft, setAircraft] = useState<NFT>()
  const { user, isLoading, isLoggedIn } = useUser()
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data: owned = [], isLoading: isLoadingNFTs } = useOwnedNFTs(contract, address)

  useEffect(() => {
    if (!address && user?.address) {
      logout()
    }
  }, [address, user?.address, logout])

  if (isLoading || (isLoadingNFTs && !!address)) {
    return <LinearProgress />
  }

  if (!isLoggedIn || (user?.address && !address)) {
    return (
      <Box mt={10} textAlign='center'>
        <GppGoodIcon sx={{ fontSize: 72 }} color='primary' />
        <Typography variant='h2' paragraph>
          Sign in
        </Typography>
        <Typography variant='h4' paragraph>
          Sign in with your wallet to checkout available flights.
        </Typography>
        <ConnectWallet />
      </Box>
    )
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
