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
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  MediaRenderer,
  NFT,
  useAddress,
  useContract,
  useNFT,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import React from "react";
import { nftAircraftTokenAddress } from "../contracts/address";
import { getNFTAttributes } from "../utils";

const aircraftsId = 0;

const MyAircrafts = () => {
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);
  const { data: nfts, isLoading, error } = useOwnedNFTs(contract, address);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Ha ocurrido un error</AlertTitle>
      </Alert>
    );
  }

  return nfts && nfts.length > 0 ? (
    <Box my={4}>
      <Typography variant="h2">My Aircrafts</Typography>
      <Grid container spacing={2}>
        {nfts?.map((nft) => (
          <Grid item xs={4} key={nft.metadata.id}>
            <Card>
              <MediaRenderer width="100%" src={nft.metadata.image} />
              <CardHeader
                title={nft.metadata.name}
                subheader={nft.metadata.description}
              />
              <CardContent>
                {getNFTAttributes(nft).length > 0 && (
                  <>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Price</Typography>
                      <Typography variant="body2">0.01</Typography>
                    </Stack>
                    {getNFTAttributes(nft).map((nft) => (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        key={nft.trait_type}
                      >
                        <Typography>{nft.trait_type}</Typography>
                        <Typography variant="body2">{nft.value}</Typography>
                      </Stack>
                    ))}
                  </>
                )}
              </CardContent>
              <CardActions></CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  ) : (
    <></>
  );
};

export default MyAircrafts;
