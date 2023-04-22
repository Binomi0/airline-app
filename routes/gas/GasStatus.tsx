import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import React from "react";
import { parseNumber } from "../../utils";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { stakingAddress } from "../../contracts/address";
import GasAvailable from "./GasAvailable";
import GasDeposited from "./GasDeposited";
import GasFarmed from "./GasFarmed";

const GasStatus = () => {
  const { contract } = useContract(stakingAddress);

  const { data: gasSupply, isLoading: isSupplyLoading } = useContractRead(
    contract,
    "getRewardTokenBalance"
  );

  return (
    <Box my={10}>
      <Typography variant="h2">Gas Station</Typography>
      <Typography variant="h5" gutterBottom>
        Para empezar deposita el token AIRL en staking
      </Typography>
      <Typography paragraph>
        Available:{" "}
        {isSupplyLoading ? (
          <CircularProgress size={14} />
        ) : (
          parseNumber(Number(gasSupply?.toString()) / 1e18)
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

export default GasStatus;
