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
  LinearProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { nftAircraftTokenAddress } from "contracts/address";
import MyAircrafts from "components/MyAircrafts";
import AircraftMarketPlace from "components/AircraftMarketPlace";
import styles from "styles/Hangar.module.css";

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
    <>
      <Box className={styles.background} py={5}>
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
          <Box my={5} textAlign="center">
            <Typography variant="h1">Virtual Airline</Typography>
            <ConnectWallet />
          </Box>

          <AircraftMarketPlace />

          <MyAircrafts />
        </Container>
      </Box>
    </>
  );
};

export default Hangar;
