import {
  Grid,
  Card,
  CardContent,
  Stack,
  Typography,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";
import {
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
import AircraftCardHeader from "./Sidebar/Aircraft/CardHeader";

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
  const { data: licenseBalance } = useNFTBalance(license, address, licenseId);

  return (
    <Grid item xs={12} lg={6}>
      <Card>
        <AircraftCardHeader nft={nft} />

        <CardContent>
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
            {licenseBalance?.isZero() ? (
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
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  `Claim ${nft.metadata.name}`
                )}
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

export default React.memo(AircraftItem);
