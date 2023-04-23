import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { Box, Container, Grid, Link, Typography } from "@mui/material";
import LicenseMarketPlace from "../components/LicenseMarketPlace";

const License: NextPage = () => {
  return (
    <Container>
      <Box my={10} textAlign="center">
        <Typography variant="h1">Virtual Airline</Typography>
        <ConnectWallet />
      </Box>

      <LicenseMarketPlace />

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

export default License;
