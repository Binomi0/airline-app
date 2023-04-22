import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import {
  MediaRenderer,
  NFT,
  useAddress,
  useClaimNFT,
  useContract,
} from "@thirdweb-dev/react";
import React from "react";
import { getNFTAttributes } from "../utils";
import { nftAircraftTokenAddress } from "../contracts/address";

const AircraftItem: React.FC<{ nft: NFT }> = ({ nft }) => {
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);
  const { mutateAsync: claimNFT, isLoading } = useClaimNFT(contract);

  return (
    <Grid item xs={3}>
      <Card>
        <MediaRenderer width="100%" src={nft.metadata.image} />
        <CardHeader
          title={nft.metadata.name}
          subheader={nft.metadata.description}
        />
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Price</Typography>
            <Typography variant="body2">0.01</Typography>
          </Stack>
          {getNFTAttributes(nft).map((attribute) => (
            <Stack
              direction="row"
              justifyContent="space-between"
              key={attribute.trait_type}
            >
              <Typography>{attribute.trait_type}</Typography>
              <Typography variant="body2">{attribute.value}</Typography>
            </Stack>
          ))}
        </CardContent>
        <CardActions>
          <Button
            disabled={isLoading}
            variant="contained"
            onClick={() =>
              claimNFT({
                to: address,
                quantity: 1,
                tokenId: nft.metadata.id,
              })
            }
          >
            Claim {nft.metadata.name}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default AircraftItem;
