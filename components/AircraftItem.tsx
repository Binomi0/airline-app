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
  CardMedia,
} from "@mui/material";
import {
  MediaRenderer,
  NFT,
  useAddress,
  useClaimNFT,
  useContract,
  useNFTBalance,
} from "@thirdweb-dev/react";
import React from "react";
import { getNFTAttributes } from "utils";
import {
  nftAircraftTokenAddress,
  nftLicenseTokenAddress,
} from "contracts/address";
import { useRouter } from "next/router";

const maps: Record<string, string> = {
  0: "0",
  1: "1",
  2: "2",
  3: "0",
  4: "3",
};
const AircraftItem: React.FC<{ nft: NFT }> = ({ nft }) => {
  const router = useRouter();
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);
  const { contract: license } = useContract(nftLicenseTokenAddress);
  const { mutateAsync: claimNFT, isLoading } = useClaimNFT(contract);
  const { data } = useNFTBalance(contract, address, nft.metadata.id);
  const { data: licenseBalance } = useNFTBalance(
    license,
    address,
    maps[nft.metadata.id]
  );

  return (
    <Grid item xs={3}>
      <Card>
        <CardHeader
          title={nft.metadata.name}
          subheader={nft.metadata.description}
        />
        <Box
          onClick={() =>
            router.push(
              `/aircraft/${nftAircraftTokenAddress}/${nft.metadata.id}`
            )
          }
        >
          <MediaRenderer height="100%" src={nft.metadata.image} />
        </Box>

        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Price</Typography>
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
            disabled={isLoading || !data?.isZero()}
            variant="contained"
            onClick={() =>
              claimNFT({
                to: address,
                quantity: 1,
                tokenId: nft.metadata.id,
              })
            }
          >
            {licenseBalance?.isZero()
              ? "Require licencia"
              : `Claim ${nft.metadata.name}`}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default AircraftItem;
