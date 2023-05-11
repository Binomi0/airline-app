import { useState } from "react";
import { NextPage } from "next";
import {
  NFT,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { nftAircraftTokenAddress } from "contracts/address";
import CargoView from "routes/Cargo/CargoView";
import { Box, Container, LinearProgress, Typography } from "@mui/material";
import CargoAircraftSelector from "routes/Cargo/components/CargoAircraftSelector";

const CargoPage: NextPage<{ loading: boolean }> = ({ loading }) => {
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);
  const { data: owned = [], isLoading } = useOwnedNFTs(contract, address);
  const [aircraft, setAircraft] = useState<NFT>();

  if (isLoading) {
    return <LinearProgress />;
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
export default CargoPage;
