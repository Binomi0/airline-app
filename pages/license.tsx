import type { NextPage } from "next";
import { Box, Container, Typography } from "@mui/material";
import LicenseMarketPlace from "../components/LicenseMarketPlace";
import styles from "styles/License.module.css";
import image from "public/img/airplanes4.png";
import Image from "next/image";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

const License: NextPage = () => {
  const address = useAddress();

  return (
    <Box sx={{ position: "relative" }}>
      <Image
        priority
        className={styles.background}
        src={image}
        alt="banner"
        fill
      />

      <Container>
        <Box my={5} textAlign="center">
          <Typography variant="h1">License Page</Typography>
          {!address && <ConnectWallet />}
        </Box>

        <LicenseMarketPlace />
      </Container>
    </Box>
  );
};

export default License;
