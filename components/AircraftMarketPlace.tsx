import {
  Box,
  Typography,
  Grid,
  Alert,
  AlertTitle,
  LinearProgress,
} from "@mui/material";
import React, { useMemo } from "react";
import { NFT, useContract, useNFTs } from "@thirdweb-dev/react";
import { nftAircraftTokenAddress } from "contracts/address";
import AircraftItem from "./AircraftItem";
import { getNFTAttributes } from "utils";

const sortByLicense = (a: NFT, b: NFT) => {
  const attributesA = getNFTAttributes(a);
  const attributesB = getNFTAttributes(b);

  const valueA = attributesA?.find((i) => i.trait_type === "license");
  const valueB = attributesB?.find((i) => i.trait_type === "license");

  if (!valueA || !valueB) {
    return 0;
  }
  if (valueA.value > valueB.value) {
    return -1;
  } else if (valueA.value < valueB.value) {
    return 1;
  }
  return 0;
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
          .sort(sortByLicense)
          .map((nft) => (
            <AircraftItem nft={nft} key={nft.metadata.id} />
          ))}
      </Grid>
    </Box>
  );
};

export default AircraftMarketPlace;
