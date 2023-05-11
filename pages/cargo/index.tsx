import { useState } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import {
  ConnectWallet,
  NFT,
  useAddress,
  useContract,
  useOwnedNFTs,
  useUser,
} from "@thirdweb-dev/react";
import { nftAircraftTokenAddress } from "contracts/address";
import CargoView from "routes/Cargo/CargoView";
import { Box, Container, LinearProgress, Typography } from "@mui/material";
import CargoAircraftSelector from "routes/Cargo/components/CargoAircraftSelector";
import serverSidePropsHandler from "components/ServerSideHandler";
import GppGoodIcon from "@mui/icons-material/GppGood";

const CargoPage: NextPage<{ loading: boolean }> = ({ loading }) => {
  const address = useAddress();
  const { user, isLoading, isLoggedIn } = useUser();
  const { contract } = useContract(nftAircraftTokenAddress);
  const { data: owned = [], isLoading: isLoadingNFTs } = useOwnedNFTs(
    contract,
    address
  );
  const [aircraft, setAircraft] = useState<NFT>();

  if (isLoading || (isLoadingNFTs && !!address)) {
    return <LinearProgress />;
  }

  if (!isLoggedIn) {
    return (
      <Box mt={10} textAlign="center">
        <GppGoodIcon sx={{ fontSize: 72 }} color="primary" />
        <Typography variant="h2" paragraph>
          Sign in
        </Typography>
        <Typography variant="h4" paragraph>
          Sign in with your wallet to checkout available flights.
        </Typography>
        <ConnectWallet />
      </Box>
    );
  }

  if (owned.length === 0) {
    <Box>
      <Container>
        <Box mt={10}>
          <Typography>
            Tienes que tener al menos 1 aeronave para acceder a esta sección.
          </Typography>
        </Box>
      </Container>
    </Box>;
  }

  return aircraft ? (
    <CargoView loading={loading} aircraft={aircraft} />
  ) : (
    <CargoAircraftSelector owned={owned} setAircraft={setAircraft} />
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  serverSidePropsHandler(ctx);

export default CargoPage;
