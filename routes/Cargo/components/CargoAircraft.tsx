import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import {
  useAddress,
  useContract,
  useNFTs,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { nftAircraftTokenAddress } from "contracts/address";
import Link from "next/link";
import React, { useCallback } from "react";
import { Cargo } from "types";
import { getNFTAttributes } from "utils";

const CargoAircraft: React.FC<{ cargo?: Cargo }> = ({ cargo }) => {
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);
  const { data: owned, isLoading } = useOwnedNFTs(contract, address);
  const { data: nfts } = useNFTs(contract);

  console.log("owned", owned);

  const hasAircraft = useCallback(
    (id: string) => {
      if (!owned) return false;
      return owned.some((i) => i.metadata.id === id);
    },
    [owned]
  );

  const available = React.useMemo(() => {
    if (!cargo || !nfts) return [];
    console.log("cargo =>", cargo);
    return nfts
      .map((item) => {
        if (!hasAircraft(item.metadata.id)) return null;

        const capacity = getNFTAttributes(item)?.find(
          (a) => a.trait_type === "cargo"
        )?.value;

        const ready = cargo.aircrafts.filter((acId) =>
          owned?.some((nft) => nft.metadata.id === acId)
        );

        console.log("Ready =>", ready);

        return cargo.weight <= Number(capacity) ? item : null;
      })
      .filter((f) => !!f);
  }, [cargo, nfts, owned, hasAircraft]);

  console.log("available =>", available);

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
      {!isLoading &&
        !!owned &&
        cargo?.aircrafts?.map(
          (id: string) =>
            hasAircraft(id) && (
              <Grid item xs={12} sm={6} key={id}>
                <Typography>{data[Number(id)]?.metadata?.name}</Typography>
                <Typography>
                  {data[Number(id)]?.metadata?.description}
                </Typography>
              </Grid>
            )
        )}
    </Grid>
  );
};

export default CargoAircraft;
