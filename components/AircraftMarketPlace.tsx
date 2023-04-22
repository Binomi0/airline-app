import {
  Box,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Stack,
  CardActions,
  Button,
  Alert,
  AlertTitle,
  LinearProgress,
  AlertColor,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { getNFTAttributes } from "../utils";
import {
  MediaRenderer,
  useAddress,
  useClaimNFT,
  useContract,
  useNFTs,
} from "@thirdweb-dev/react";
import { nftAircraftTokenAddress } from "../contracts/address";
import AircraftItem from "./AircraftItem";

interface ErrorType {
  message: string;
}

const initialSnackState = {
  open: false,
  title: "",
  message: "",
  type: "info" as AlertColor,
};

const AircraftMarketPlace: React.FC = () => {
  const { contract } = useContract(nftAircraftTokenAddress);
  const { data: nfts, isLoading, error } = useNFTs(contract);

  const nftList = useMemo(() => (nfts && nfts.length > 0 ? nfts : []), [nfts]);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (error) {
    console.log("error", error);
    return (
      <Alert severity="error">
        <AlertTitle>Ha ocurrido un error</AlertTitle>
      </Alert>
    );
  }

  return (
    <Box my={4}>
      <Typography variant="h2">MarketPlace</Typography>
      <Grid container spacing={2}>
        {nftList
          .filter((a) => a.metadata.id !== "0")
          .map((nft) => (
            <AircraftItem nft={nft} key={nft.metadata.id} />
          ))}
      </Grid>
    </Box>
  );
};

export default AircraftMarketPlace;
