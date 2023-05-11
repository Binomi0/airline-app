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
  useBalance,
  useClaimNFT,
  useContract,
  useNFT,
} from "@thirdweb-dev/react";
import React, { useCallback } from "react";
import { getNFTAttributes } from "utils";
import { nftLicenseTokenAddress } from "contracts/address";
import { coinTokenAddress } from "contracts/address";
import BigNumber from "bignumber.js";

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

  return (
    <Grid item xs={12} md={6} lg={4}>
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
              disabled={isClaiming}
              variant="contained"
              onClick={handleClaimLicense}
            >
              Claim {nft.metadata.name}
            </Button>
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

export default LicenseItem;
