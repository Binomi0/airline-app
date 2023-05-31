import type { GetServerSidePropsContext, NextPage } from "next";
import { Box, Container, Typography } from "@mui/material";
import LicenseMarketPlace from "../components/LicenseMarketPlace";
import styles from "styles/License.module.css";
import image from "public/img/airplanes4.png";
import Image from "next/image";
import { ConnectWallet, useUser } from "@thirdweb-dev/react";
import serverSidePropsHandler from "components/ServerSideHandler";

const License: NextPage = () => {
  const { isLoggedIn } = useUser();

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
          {!isLoggedIn && <ConnectWallet />}
        </Box>

        <LicenseMarketPlace />
      </Container>
    </Box>
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  serverSidePropsHandler(ctx);

export default License;
