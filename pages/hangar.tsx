import {
  ConnectWallet,
  useContract,
  useAddress,
  useNFTs,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import {
  Alert,
  AlertColor,
  AlertTitle,
  Box,
  Container,
  Grid,
  LinearProgress,
  Link,
  Snackbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { nftAircraftTokenAddress } from "../contracts/address";
import MyAircrafts from "../components/MyAircrafts";
import AircraftMarketPlace from "../components/AircraftMarketPlace";

interface AircraftAttributes {
  deposit: number;
  cargo: number;
  license: string;
}

interface AirlineNFT {
  metadata: {
    attributes: AircraftAttributes[];
    name: string;
    description: string;
    image: string;
  };
}

const initialSnackState = {
  open: false,
  title: "",
  message: "",
  type: "info" as AlertColor,
};

interface HangarProps {
  loading: boolean;
}

const Hangar: NextPage<HangarProps> = ({ loading }) => {
  const [snack, setSnack] = useState(initialSnackState);
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);
  const { data: nfts, isLoading, error } = useNFTs(contract);

  if (isLoading || !nfts || loading) {
    return <LinearProgress />;
  }

  if (error) {
    console.log("errorNFTs", error);
    return (
      <Alert severity="error">
        <AlertTitle>Ha ocurrido un error</AlertTitle>
      </Alert>
    );
  }

  if (!address) {
    return <div>no address</div>;
  }

  return (
    <Container>
      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack(initialSnackState)}
      >
        <Alert
          onClose={() => setSnack(initialSnackState)}
          severity={snack.type}
          sx={{ width: "100%" }}
        >
          <AlertTitle>{snack.title}</AlertTitle>
          <Typography>{snack.message}</Typography>
        </Alert>
      </Snackbar>
      <Box my={10} textAlign="center">
        <Typography variant="h1">Virtual Airline</Typography>
        <ConnectWallet />
      </Box>

      <AircraftMarketPlace />

      <MyAircrafts />

      <Grid container spacing={2}>
        <Grid item xs={4} p={2}>
          <Link href="/">
            <Typography variant="h4" paragraph>
              Home &rarr;
            </Typography>
          </Link>
          <Typography>Ir a la página principal</Typography>
        </Grid>
        <Grid item xs={4} p={2}>
          <Link href="/license">
            <Typography variant="h4" paragraph>
              Licencias &rarr;
            </Typography>
          </Link>
          <Typography>
            Grow, adquire a licence and start flying today.
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Link href="/gas">
            <Typography variant="h4" paragraph>
              Gas &rarr;
            </Typography>
          </Link>
          <Typography>
            Stake tokens and earn Gas to refuel your aircrafts.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Hangar;
