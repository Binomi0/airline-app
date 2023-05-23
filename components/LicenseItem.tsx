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
  CircularProgress,
} from "@mui/material";
import {
  MediaRenderer,
  NFT,
  useAddress,
  useBalance,
  useClaimNFT,
  useContract,
  useNFT,
} from "@thirdweb-dev/react";
import React, { useCallback, useMemo } from "react";
import { getNFTAttributes } from "utils";
import { nftLicenseTokenAddress } from "contracts/address";
import { coinTokenAddress } from "contracts/address";
import BigNumber from "bignumber.js";
import AircraftCardHeader from "./Aircraft/CardHeader";
import LicenseItemHeader from "./License/LicenseItemHeader";

const LicenseItem: React.FC<{ nft: NFT; owned: boolean }> = ({
  nft,
  owned,
}) => {
  const address = useAddress();
  const { contract } = useContract(nftLicenseTokenAddress);
  const { mutateAsync: claimNFT, isLoading: isClaiming } =
    useClaimNFT(contract);
  const { data: airlBalance } = useBalance(coinTokenAddress);

  const handleClaimLicense = useCallback(() => {
    if (!airlBalance) return;

    const attribute = getNFTAttributes(nft).find(
      (attr) => attr.trait_type === "price"
    );
    if (!attribute) {
      throw new Error("missing price in nft");
    }

    const hasEnough = new BigNumber(airlBalance.displayValue).isGreaterThan(
      attribute.value
    );
    if (hasEnough) {
      claimNFT({
        to: address,
        quantity: 1,
        tokenId: nft.metadata.id,
      });
    } else {
      console.log(`You do not have enough AIRL tokens, ${attribute.value}`);
    }
  }, [claimNFT, address, airlBalance, nft]);

  const getNFTPrice = useCallback((nft: NFT) => {
    const attribute = getNFTAttributes(nft).find(
      (attr) => attr.trait_type === "price"
    );
    if (!attribute) {
      throw new Error("missing types");
    }

    return attribute.value;
  }, []);

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card>
        <LicenseItemHeader nft={nft} owned={owned} />

        <CardContent>
          {getNFTAttributes(nft).map((attribute) => (
            <Stack
              direction="row"
              justifyContent="space-between"
              key={attribute.trait_type}
            >
              <Typography>{attribute.trait_type}</Typography>
              <Typography variant="body2">
                {attribute.value} {attribute.trait_type === "price" && "AIRL"}
              </Typography>
            </Stack>
          ))}
        </CardContent>

        {!owned && (
          <CardActions>
            <Button
              disabled={isClaiming || !address}
              variant="contained"
              onClick={handleClaimLicense}
            >
              {isClaiming ? (
                <CircularProgress size={25} />
              ) : (
                `Claim ${
                  (nft.metadata.name as string)?.split(" - ")[1]
                } for ${getNFTPrice(nft)} AIRL`
              )}
            </Button>
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

export default LicenseItem;
