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
import Image from "next/image";
import image from "public/img/airplanes3.png";

interface HangarProps {
  loading: boolean;
}

const Hangar: NextPage<HangarProps> = ({ loading }) => {
  const address = useAddress();

  if (loading) {
    return <LinearProgress />;
  }

  console.count("Hangar");
  return (
    <Box sx={{ position: "relative" }}>
      <Image
        alt="banner"
        className={styles.background}
        fill
        placeholder="blur"
        priority
        src={image}
      />
      <Container>
        <Box my={5} textAlign="center">
          <Typography variant="h1">Main Hangar</Typography>
          {!address && <ConnectWallet />}
        </Box>

        <AircraftMarketPlace />

        {/* {address && <MyAircrafts />} */}
      </Container>
    </Box>
  );
};

export default Hangar;
