import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback } from "react";
import AircraftMarketPlace from "../components/AircraftMarketPlace";
import LicenseMarketPlace from "../components/LicenseMarketPlace";

type LicenseType = "A" | "B" | "C" | "D";

const License: NextPage = () => {
  // const canGetLicense = useCallback((license: LicenseType) => {
  //   switch (license) {
  //     case "D":
  //       return true;
  //     case "C":
  //       return user.license.includes("D");
  //     case "B":
  //       return user.license.includes("C");
  //     case "A":
  //       return user.license.includes("B");
  //     default:
  //       return false;
  //   }
  // }, []);
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
