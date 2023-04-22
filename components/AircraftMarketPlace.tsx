import {
  Box,
  Typography,
  Grid,
  Alert,
  AlertTitle,
  LinearProgress,
} from "@mui/material";
import React, { useMemo } from "react";
import { useContract, useNFTs } from "@thirdweb-dev/react";
import { nftAircraftTokenAddress } from "../contracts/address";
import AircraftItem from "./AircraftItem";

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
