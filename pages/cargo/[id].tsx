import React, { useCallback } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  AlertTitle,
  Box,
  Link as MuiLink,
  Container,
  Typography,
  Button,
} from "@mui/material";
import Image from "next/image";
import image from "public/img/real_replica_cessna_172.png";
import styles from "styles/Home.module.css";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useNFTBalance,
} from "@thirdweb-dev/react";
import { nftAircraftTokenAddress } from "contracts/address";
import Link from "next/link";
import axios from "config/axios";

const CargoItem = () => {
  const router = useRouter();
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);

  const { data } = useNFTBalance(contract, address, 1);

  const handleClick = useCallback(() => {
    axios.post("/api/flight/new", { cargoId: router.query.id });
  }, [router.query.id]);

  return !address ? (
    <ConnectWallet />
  ) : (
    <Box sx={{ position: "relative" }}>
      <Image
        priority
        className={styles.background}
        style={{ opacity: 0.4 }}
        src={image}
        alt="banner"
        fill
      />
      <Container>
        <Box my={6}>
          <Box>
            <Typography align="center" variant="h1">
              New Cargo #{router.query.id}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Alert severity="info">
            <AlertTitle>Recommended aircraft: </AlertTitle>
            <Typography variant="overline">Cessna 172 Skyhawk</Typography>
          </Alert>
        </Box>

        {data?.isZero() ? (
          <Box my={2}>
            <Alert severity="warning">
              <AlertTitle>No available aircraft</AlertTitle>
              <Typography>
                you don&apos;t have yet a valid aircraft to transport this
                cargo. Please go to
                <Link href="/hangar">
                  <MuiLink underline="hover"> hangar </MuiLink>
                </Link>
                and get one before.
              </Typography>
            </Alert>
          </Box>
        ) : (
          <Box my={4}>
            <Typography paragraph>
              Great! You owns the right aircraft to perform this cargo flight.
            </Typography>
            <Button onClick={handleClick} variant="contained">
              Start Flight
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CargoItem;
