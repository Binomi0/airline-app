import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  NFT,
  useAddress,
  useClaimNFT,
  useContract,
  useLazyMint,
  useNFTs,
  useOwnedNFTs,
  useSetClaimConditions,
} from "@thirdweb-dev/react";
import { flightNftAddress, nftAircraftTokenAddress } from "contracts/address";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import { Aircraft, Cargo, License, LicenseType } from "types";
import { getNFTAttributes, randomIntFromInterval } from "utils";

const CargoAircraft: React.FC<{ cargo?: Cargo }> = ({ cargo }) => {
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);
  const { contract: flightContract } = useContract(flightNftAddress);
  const { data: owned, isLoading } = useOwnedNFTs(contract, address);
  const { data: nfts } = useNFTs(contract);
  const { mutateAsync: lazyMint, isLoading: isMinting } =
    useLazyMint(flightContract);
  const { mutateAsync: claimNFT, isLoading: isClaiming } =
    useClaimNFT(flightContract);
  const { mutate: setClaimConditions, error } =
    useSetClaimConditions(flightContract);

  const getAircraftPrize = useCallback(
    (aircraft: NFT) => {
      const item = getNFTAttributes(aircraft).find(
        (attribute) => attribute.trait_type === "license"
      );

      if (!item || !cargo) {
        throw new Error("missing item type");
      }

      console.log("prize =>", cargo.prize);
      console.log("item.value =>", item.value);
      switch (item.value) {
        case License.D:
          return cargo.prize;
        case License.C:
          return Math.floor(Number(cargo.prize * 10));
        case License.B:
          return Math.floor(Number(cargo.prize) * 100);
        case License.A:
          return Math.floor(Number(cargo.prize) * 1000);
        default:
          return 0;
      }
    },
    [cargo]
  );

  const maxAircraftWeight = useCallback(
    (id: string): number => {
      if (!owned) return 0;
      const aircraft = owned.find((nft) => nft.metadata.id === id);
      if (!id || !aircraft) return 0;

      const attribute = getNFTAttributes(aircraft).find(
        (attribute) => attribute.trait_type === "cargo"
      );

      return attribute ? Number(attribute.value) : 0;
    },
    [owned]
  );

  const currentWeight = useCallback(
    (id: string) => maxAircraftWeight(id) * randomIntFromInterval(35, 75),
    [maxAircraftWeight]
  );

  const progressBar = useCallback(
    (id: string) => (currentWeight(id) / maxAircraftWeight(id)) * 100,
    [maxAircraftWeight, currentWeight]
  );

  const handleLazyMint = useCallback(async () => {
    await lazyMint({
      // Metadata of the NFTs to upload

      metadatas: [
        {
          name: `${cargo?.origin} - ${cargo?.destination}`,
          description: `User: ${address}, flight on ${Date.now()} this cargo`,
          image: "ipfs://QmWgvZzrNpQyyRyrEtsDUM7kyguAZurbSa2XKAHpRy415z",
          attributes: [{ cargo }],
        },
      ],
    });
  }, [lazyMint, cargo, address]);

  // const handleSetClaimConditions = useCallback(() => {
  //   setClaimConditions({
  //     phases: [
  //       {
  //         metadata: { name: "Phase 1" },
  //         price: 10,
  //         currencyAddress: "0x773F0e20Ab2E9afC479C82105E924C2E0Ada5aa9",
  //         maxClaimablePerWallet: 1,
  //         maxClaimableSupply: 1,
  //         startTime: new Date(),
  //       },
  //     ],
  //   });
  // }, [setClaimConditions]);

  const handleClaim = useCallback(async () => {
    await claimNFT({
      to: address,
      quantity: 1,
      tokenId: 0,
      options: {
        checkERC20Allowance: true,
        currencyAddress: "0x773F0e20Ab2E9afC479C82105E924C2E0Ada5aa9",
        pricePerToken: 0,
      },
    });
  }, [claimNFT, address]);

  if (!nfts || isLoading) {
    return <LinearProgress />;
  }

  return (
    <Grid container spacing={2}>
      {!isLoading && !owned && (
        <Box>
          <Typography>
            No tienes aeronaves compatibles con este vuelo.
          </Typography>
          <Link href="/hangar">
            <Typography variant="overline">
              Consigue una aeronave aquí.
            </Typography>
          </Link>
        </Box>
      )}
      {!isLoading && !!owned && owned.length > 0 ? (
        owned.map((aircraft) => (
          <Grid item xs={12} sm={6} key={aircraft.metadata.id}>
            <Card>
              <CardHeader
                title={aircraft.metadata.name}
                subheader={aircraft.metadata.description}
              />
              <CardContent>
                <Stack>
                  <LinearProgress
                    color="success"
                    variant="determinate"
                    value={progressBar(aircraft.metadata.id)}
                  />
                  <Typography textAlign="center" variant="caption">
                    Cargo weight:{" "}
                    <b>
                      {Intl.NumberFormat("en").format(
                        currentWeight(aircraft.metadata.id)
                      )}{" "}
                      Kg
                    </b>
                  </Typography>
                  <Typography textAlign="center" variant="caption">
                    Max Capacity:{" "}
                    <b>
                      {
                        getNFTAttributes(aircraft).find(
                          (a) => a.trait_type === "cargo"
                        )?.value
                      }{" "}
                      Kg
                    </b>
                  </Typography>
                  <Typography>
                    Callsign: <b>{cargo?.callsign}</b>
                  </Typography>
                  <Typography>
                    Prize:{" "}
                    <b>
                      {Intl.NumberFormat("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(getAircraftPrize(aircraft) as number)}
                    </b>
                  </Typography>
                </Stack>
              </CardContent>

              <CardActions>
                <Button
                  disabled={!address}
                  color="secondary"
                  variant="contained"
                  fullWidth
                  onClick={handleClaim}
                >
                  Claim
                </Button>
                <Button
                  disabled={!address}
                  color="secondary"
                  variant="contained"
                  fullWidth
                  onClick={handleLazyMint}
                >
                  LazyMint
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <Box px={2}>
          <Alert severity="error">
            <AlertTitle>
              No tienes aeronaves compatibles con este vuelo.
            </AlertTitle>
            <Link href="/hangar">
              <Typography variant="overline">
                Consigue una aeronave aquí.
              </Typography>
            </Link>
          </Alert>
        </Box>
      )}
    </Grid>
  );
};

export default React.memo(CargoAircraft);
