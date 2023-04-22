import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { Box, Container, Grid, Link, Typography } from "@mui/material";
import GasStatus from "../routes/gas/GasStatus";

const Gas: NextPage = () => {
  return (
    <Container>
      <Box my={10} textAlign="center">
        <Typography variant="h1">Virtual Airline</Typography>
        <ConnectWallet />
      </Box>

      <GasStatus />

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
