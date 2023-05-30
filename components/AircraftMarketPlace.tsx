import React, { useCallback } from "react";
import { Box, Grid, Fade } from "@mui/material";
import { useAddress, useClaimNFT, useContract } from "@thirdweb-dev/react";
import useLicense from "hooks/useLicense";
import { getLicenseIdFromAttributes, getNFTAttributes } from "utils";
import useAircrafts from "hooks/useAircrafts";
import AircraftItem from "./AircraftItem";
import { nftAircraftTokenAddress } from "contracts/address";

const AircraftMarketPlace: React.FC = () => {
  const address = useAddress();
  const licenses = useLicense();
  const aircrafts = useAircrafts();
  const { contract: aircraftContract } = useContract(nftAircraftTokenAddress);
  const { mutateAsync, isLoading: isClaiming } = useClaimNFT(aircraftContract);

  const handleClaim = useCallback(
    (tokenId: string) => {
      mutateAsync({ to: address, quantity: 1, tokenId });
    },
    [mutateAsync, address]
  );

  return (
    <Box my={4}>
      <Fade in unmountOnExit>
        <Grid container spacing={6}>
          {aircrafts.map((aircraft) => (
            <AircraftItem
              nft={aircraft}
              key={aircraft.metadata.id}
              onClaim={handleClaim}
              isClaiming={isClaiming}
              hasLicense={licenses.current.get(
                getLicenseIdFromAttributes(getNFTAttributes(aircraft))
              )}
            />
          ))}
        </Grid>
      </Fade>
    </Box>
  );
};

export default AircraftMarketPlace;
