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
import { Aircraft } from "types";

const licenses: Record<string, string> = {
  A: "0",
  B: "1",
  C: "2",
  D: "3",
};

const maps: Record<string, string> = {
  0: "0",
  1: Aircraft.C700,
  2: Aircraft.B737,
  3: Aircraft.C172,
  4: Aircraft.AN225,
};

const AircraftItem: React.FC<{ nft: NFT }> = ({ nft }) => {
  const router = useRouter();
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);
  const { contract: license } = useContract(nftLicenseTokenAddress);
  const { mutateAsync: claimNFT, isLoading } = useClaimNFT(contract);
  const { data } = useNFTBalance(contract, address, nft.metadata.id);
  const licenseId = getNFTAttributes(nft).find(
    (attribute) => attribute.trait_type === "license"
  )?.value;
  console.log("licenseId =>", licenseId);

  const { data: licenseBalance } = useNFTBalance(
    license,
    address,
    licenses[licenseId || ""]
  );

  console.log("licenseBalance =>", licenseBalance?.toString());

  return (
    <Grid item xs={12} lg={3}>
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
        {data?.isZero() && (
          <CardActions>
            {!licenseBalance?.isZero() ? (
              <Button
                disabled={isLoading}
                variant="contained"
                onClick={() => router.push("/license")}
              >
                Require licencia
              </Button>
            ) : (
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
            )}
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

export default AircraftItem;
