import { Grid, Card, Box, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useBalance, useContract, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { formatNumber } from "utils";
import { coinTokenAddress, stakingAddress } from "contracts/address";
import GasAvailableForm from "./components/GasAvailableForm";

const GasAvailable = () => {
  const { data: airl } = useBalance(coinTokenAddress);
  const { contract: coin } = useContract(coinTokenAddress, "token");
  const { contract: staking, refetch } = useContract(stakingAddress);
  const { mutateAsync: stake } = useContractWrite(staking, "stake");
  const [loading, setLoading] = useState(false);

  const setAllowance = useCallback(
    async (amount: string) => {
      try {
        await coin?.erc20.setAllowance(
          stakingAddress,
          ethers.utils.parseEther(amount).toString()
        );
        return true;
      } catch (error) {
        return false;
      }
    },
    [coin]
  );

  const handleStake = useCallback(
    async (amount: string) => {
      setLoading(true);
      if (await setAllowance(amount)) {
        await stake({
          args: [ethers.utils.parseEther(amount)],
        });
      }
      setLoading(false);
    },
    [setAllowance, stake]
  );

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
