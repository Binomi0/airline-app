import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const theme = useTheme();

  return (
    <>
      <Box className={styles.background} py={10} mt={1}>
        <Container>
          <Box my={10} textAlign="center">
            <Typography variant="h1">Virtual Airline</Typography>
            <ConnectWallet />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={4} p={2}>
              <Link href="/hangar">
                <Typography
                  variant="h4"
                  paragraph
                  sx={{ textShadow: `2px 2px ${theme.palette.primary.dark}` }}
                >
                  Hangar &rarr;
                </Typography>
              </Link>
              <Typography>
                Aircrafts, buy and sell aircraft NFT&apos;s
              </Typography>
            </Grid>
            <Grid item xs={4} p={2}>
              <Link href="/license">
                <Typography
                  variant="h4"
                  paragraph
                  sx={{ textShadow: `2px 2px ${theme.palette.primary.dark}` }}
                >
                  Licencias &rarr;
                </Typography>
              </Link>
              <Typography>
                Grow, adquire a licence and start flying today.
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Link href="/gas">
                <Typography
                  variant="h4"
                  paragraph
                  sx={{ textShadow: `2px 2px ${theme.palette.primary.dark}` }}
                >
                  Gas &rarr;
                </Typography>
              </Link>
              <Typography>
                Stake tokens and earn Gas to refuel your aircrafts.
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Link href="/cargo">
                <Typography
                  variant="h4"
                  paragraph
                  sx={{ textShadow: `2px 2px ${theme.palette.primary.dark}` }}
                >
                  Cargo &rarr;
                </Typography>
              </Link>
              <Typography>
                Realiza alguno de los vuelos pendientes y gana tokens AIRL.
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Link href="/ivao">
                <Typography
                  variant="h4"
                  paragraph
                  sx={{ textShadow: `2px 2px ${theme.palette.primary.dark}` }}
                >
                  IVAO &rarr;
                </Typography>
              </Link>
              <Typography>
                Monitoriza tus vuelos en IVAO y gana recompensas.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Home;
