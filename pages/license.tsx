import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { Box, Container, Typography } from "@mui/material";
import LicenseMarketPlace from "../components/LicenseMarketPlace";
import styles from "styles/License.module.css";

const License: NextPage = () => {
  return (
    <>
      <Box className={styles.background} py={5}>
        <Container>
          <Box my={5} textAlign="center">
            <Typography variant="h1">Virtual Airline</Typography>
            <ConnectWallet />
          </Box>

          <LicenseMarketPlace />
        </Container>
      </Box>
    </>
  );
};

export default License;
