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
  useAddress,
  useContract,
  useNFTs,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { nftAircraftTokenAddress } from "contracts/address";
import moment from "moment";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import { Cargo } from "types";
import { getNFTAttributes } from "utils";

const CargoAircraft: React.FC<{ cargo?: Cargo }> = ({ cargo }) => {
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);
  const { data: owned, isLoading } = useOwnedNFTs(contract, address);
  const { data: nfts } = useNFTs(contract);

  console.log("[CargoAircraft] owned =>", owned);

  const hasAircraft = useCallback(
    (id: string) => {
      if (!owned) return false;
      console.log("id =>", id);
      return owned.some((nft) => nft.metadata.id === id);
    },
    [owned]
  );

  // const available = React.useMemo(() => {
  //   if (!cargo || !nfts) return [];
  //   console.log("cargo =>", cargo);
  //   return nfts
  //     .map((item) => {
  //       if (!hasAircraft(item.metadata.id)) return null;

  //       const capacity = getNFTAttributes(item)?.find(
  //         (a) => a.trait_type === "cargo"
  //       )?.value;

  //       const ready = cargo.aircrafts.filter((acId) =>
  //         owned?.some((nft) => nft.metadata.id === acId)
  //       );

  //       console.log("Ready =>", ready);

  //       return cargo.weight <= Number(capacity) ? item : null;
  //     })
  //     .filter((f) => !!f);
  // }, [cargo, nfts, owned, hasAircraft]);

  const maxAircraftWeight = useCallback(
    (id: string): number => {
      if (!owned) return 0;
      const aircraft = owned.find((nft) => nft.metadata.id === id);
      if (!id || !aircraft) return 0;

      const attribute = getNFTAttributes(aircraft).find(
        (attribute) => attribute.trait_type === "cargo"
      );

      return attribute ? Number(attribute.value) : 0;

      // const value = Number(attribute?.value);
      // return attribute ? ((value * 0.6) / value) * 100 : 0;
    },
    [owned]
  );

  const currentWeight = useCallback(
    (id: string) => {
      const maxWeight = maxAircraftWeight(id);
      if (!maxAircraftWeight) return 0;

      return maxWeight * 0.6;
    },
    [maxAircraftWeight]
  );

  const progressBar = useCallback(
    (id: string) => {
      const weight = currentWeight(id);
      if (!weight) return 0;

      return (currentWeight(id) / maxAircraftWeight(id)) * 100;
    },
    [maxAircraftWeight, currentWeight]
  );

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
                    <b>{currentWeight(aircraft.metadata.id)} Kg</b>
                  </Typography>
                  <Typography textAlign="center" variant="caption">
                    Max Weight:{" "}
                    <b>
                      {
                        getNFTAttributes(aircraft).find(
                          (a) => a.trait_type === "cargo"
                        )?.value
                      }{" "}
                      Kg
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
                  onClick={() => {}}
                >
                  Volar ahora
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
