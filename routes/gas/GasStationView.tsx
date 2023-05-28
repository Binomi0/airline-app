import React, { useEffect } from "react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { stakingAddress } from "contracts/address";
import { formatNumber } from "utils";
import GasAvailable from "./GasAvailable";
import GasDeposited from "./GasDeposited";
import GasFarmed from "./GasFarmed";

const GasStationView = () => {
  const { contract } = useContract(stakingAddress);
  const {
    data: gasSupply,
    isLoading: isSupplyLoading,
    refetch: getRewardsTokenBalance,
  } = useContractRead(contract, "getRewardTokenBalance");

  useEffect(() => {
    const timer = setInterval(getRewardsTokenBalance, 15000);
    return () => clearInterval(timer);
  }, [getRewardsTokenBalance]);

  return (
    <Box my={5}>
      <Typography variant="h5" gutterBottom>
        Before Start Checklist, deposit AIRL Token in staking and start earning
        gasoline.
      </Typography>
      <Typography paragraph>
        Available:{" "}
        {isSupplyLoading ? (
          <CircularProgress size={14} />
        ) : (
          formatNumber(Number(gasSupply?.toString()) / 1e18)
        )}{" "}
        Liters
      </Typography>
      <Grid container spacing={2}>
        <GasAvailable />
        <GasDeposited />
        <GasFarmed />
      </Grid>
    </Box>
  );
};

export default GasStationView;
