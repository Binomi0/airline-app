import { Box, Fade, LinearProgress } from "@mui/material";
import {
  useAddress,
  useContract,
  useNFT,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import serverSidePropsHandler from "components/ServerSideHandler";
import { VaProvider } from "context/VaProvider";
import { nftAircraftTokenAddress } from "contracts/address";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import CargoView from "routes/Cargo/CargoView";

const CargoAircraft: NextPage<{ loading: boolean }> = ({ loading }) => {
  const router = useRouter();
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);
  const { data, isLoading } = useNFT(contract, router.query.aircraft as string);
  const { data: owned, isLoading: isLoadingOwn } = useOwnedNFTs(
    contract,
    address
  );

  const hasAircraft = useMemo(() => {
    if (!owned || !data) return false;
    return owned.some((nft) => nft.metadata.id === data.metadata.id);
  }, [owned, data]);

  useEffect(() => {
    if (!address) {
      router.push("/cargo");
    }
  }, [address, router]);

  useEffect(() => {
    if (!!owned && !!data && !isLoading && !isLoadingOwn && !hasAircraft) {
      router.push("/hangar");
    }
  }, [owned, data, isLoading, isLoadingOwn, router, hasAircraft]);

  return (
    <VaProvider>
      <Fade in={isLoading || isLoadingOwn}>
        <Box>
          <LinearProgress />
        </Box>
      </Fade>
      <Fade in={!isLoading && !isLoadingOwn}>
        <Box>
          {hasAircraft ? <CargoView loading={loading} aircraft={data} /> : null}
        </Box>
      </Fade>
    </VaProvider>
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  serverSidePropsHandler(ctx);

export default CargoAircraft;
