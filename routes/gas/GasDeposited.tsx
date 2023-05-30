import { Grid, Card, Box, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { formatNumber } from "utils";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { stakingAddress } from "contracts/address";
import GasForm from "./components/GasForm";
import { ethers } from "ethers";

const GasDeposited = () => {
  const address = useAddress();
  const { contract } = useContract(stakingAddress);
  const { data: staking } = useContractRead(contract, "stakers", [address]);
  const { mutateAsync: withdraw, isLoading } = useContractWrite(
    contract,
    "withdraw"
  );
  const maxAmount = (Number(staking?.amountStaked) / 1e18).toString();

  const handleUnStake = useCallback(
    async (unstakeAmount: string) => {
      withdraw({ args: [ethers.utils.parseEther(unstakeAmount)] });
    },
    [withdraw]
  );

  return (
    <Grid item xs={4}>
      <Card>
        <Box p={1}>
          <Typography variant="subtitle1">Deposited</Typography>
          <Typography variant="subtitle2" paragraph>
            {staking
              ? formatNumber(Number(staking.amountStaked.toString()) / 1e18)
              : formatNumber()}{" "}
            AIRL
          </Typography>
          <GasForm
            max={maxAmount}
            onClick={handleUnStake}
            loading={isLoading}
            label="Amount to UnStake"
            buttonText="Remove from Staking"
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default GasDeposited;
