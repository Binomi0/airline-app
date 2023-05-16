import {
  Grid,
  Card,
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useBalance, useContract, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { formatNumber } from "utils";
import { coinTokenAddress, stakingAddress } from "contracts/address";
import GasAvailableForm from "./components/GasAvailableForm";

let maxAmount = "";

const GasAvailable = () => {
  const stakeAmountRef = useRef<HTMLInputElement>();
  const { data: airl } = useBalance(coinTokenAddress);
  const { contract: coin } = useContract(coinTokenAddress, "token");
  const { contract: staking, refetch } = useContract(stakingAddress);
  const { mutateAsync: stake } = useContractWrite(staking, "stake");
  const [loading, setLoading] = useState(false);

  const handleStake = useCallback(async () => {
    setLoading(true);
    await coin?.erc20.setAllowance(
      stakingAddress,
      ethers.utils.parseEther(stakeAmountRef?.current?.value || "0").toString()
    );

    await stake({
      args: [ethers.utils.parseEther(stakeAmountRef?.current?.value || "0")],
    });
    setLoading(false);
  }, [coin, stakeAmountRef, stake]);

  useEffect(() => {
    const timer = setInterval(refetch, 10000);
    return () => clearInterval(timer);
  }, [refetch]);

  return (
    <Grid item xs={4}>
      <Card>
        <Box p={1}>
          <Typography variant="subtitle1">Available to deposit</Typography>
          <Typography variant="subtitle2" paragraph>
            {formatNumber(Number(airl?.displayValue))} AIRL
          </Typography>
          <GasAvailableForm
            max={airl?.displayValue || ""}
            onStake={handleStake}
            loading={loading}
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default GasAvailable;
