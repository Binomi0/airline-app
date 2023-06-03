import { Stack, Typography, useMediaQuery } from "@mui/material";
import { useBalance } from "@thirdweb-dev/react";
import { rewardTokenAddress } from "contracts/address";
import React from "react";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import BigNumber from "bignumber.js";

const GasBalanceBar = () => {
  const balance = useBalance(rewardTokenAddress);

  return (
    <Stack direction="row" alignItems="center" mx={2} spacing={1}>
      <LocalGasStationIcon color="inherit" fontSize="medium" />
      <Typography variant="h6">
        {Intl.NumberFormat("en", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(
          new BigNumber(balance.data?.displayValue || 0).toNumber()
        )}{" "}
        AIRG
      </Typography>
    </Stack>
  );
};

export default GasBalanceBar;
