import {
  ConnectWallet,
  Web3Button,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import {
  Alert,
  AlertTitle,
  Box,
  Container,
  Grid,
  LinearProgress,
  Link,
  Typography,
} from "@mui/material";
import { useCallback } from "react";
import airlineCoin from "../contracts/abi/AirlineCoin.json";

const stakingAddress = "0x005A07a7F98bB9dD75E7130Da5E37CdE2D1E7E1C";
const coinTokenAddress = "0xfdc7C97F7B006dDd1F0B48bf35BE5aeB7153d2b6";
const rewardTokenAddress = "0x4eF73A2AC6DB13F309F824b7206672954aF62C4d";

const Gas: NextPage = () => {
  return (
    <Container>
      <Box my={10} textAlign="center">
        <Typography variant="h1">Virtual Airline</Typography>
        <ConnectWallet />
      </Box>

      <Box my={10}>
        <Typography variant="h2">Aquí puedes repostar tus aeronaves</Typography>
        <Typography>Para empezar deposita el token AIRL en staking</Typography>
      </Box>

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
          <Link href="/hangar">
            <Typography variant="h4" paragraph>
              Hangar &rarr;
            </Typography>
          </Link>
          <Typography>Aircrafts, buy and sell aircraft NFT&apos;s</Typography>
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
      </Grid>
    </Container>
  );
};

export default Gas;
