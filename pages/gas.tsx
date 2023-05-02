import { ConnectWallet, useBalance } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { Box, Container, Stack, Typography } from "@mui/material";
import GasStatus from "routes/gas/GasStatus";
import styles from "styles/Gas.module.css";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { rewardTokenAddress } from "contracts/address";
import Image from "next/image";
import image from "public/img/airplanes.png";

const Gas: NextPage = () => {
  const { data } = useBalance(rewardTokenAddress);

  return (
    <>
      <Image className={styles.background} src={image} alt="banner" fill />

      <Container>
        <Stack direction="row-reverse">
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocalGasStationIcon />
            <Typography variant="h2">{data?.displayValue}</Typography>
            <Typography variant="h6">{data?.symbol}</Typography>
          </Stack>
        </Stack>
        <Box my={2} textAlign="center">
          <Typography variant="h1">Virtual Airline</Typography>
        </Box>

        <GasStatus />
      </Container>
    </>
  );
};

export default Gas;
