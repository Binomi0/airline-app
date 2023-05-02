import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import {
  MediaRenderer,
  NFT,
  useAddress,
  useClaimNFT,
  useContract,
} from "@thirdweb-dev/react";
import React from "react";
import { getNFTAttributes } from "utils";
import { nftLicenseTokenAddress } from "contracts/address";

const LicenseItem: React.FC<{ nft: NFT; owned: boolean }> = ({
  nft,
  owned,
}) => {
  const address = useAddress();
  const { contract } = useContract(nftLicenseTokenAddress);
  const { mutateAsync: claimNFT, isLoading: isClaiming } =
    useClaimNFT(contract);

  return (
    <Grid item xs={4}>
      <Card>
        <Box
          sx={{
            position: "relative",
            top: 0,
            left: 0,
            "&::before": {
              position: "relative",
              content: `${owned ? "'OWNED'" : "'LOCKED'"}`,
              width: "50px",
              height: "50px",
              top: 10,
              left: 10,
              fontSize: "36px",
              color: `${owned ? "green" : "red"}`,
              background: "white",
              padding: 1,
              borderRadius: 2,
              textShadow: `2px 2px ${owned ? "lightGreen" : "orange"}`,
              boxShadow: `0 0 8px 0px ${owned ? "green" : "red"}`,
            },
          }}
        >
          <MediaRenderer width="100%" src={nft.metadata.image} />
        </Box>
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
            disabled={isClaiming || owned}
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

export default LicenseItem;
