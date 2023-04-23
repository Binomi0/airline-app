import {
  Grid,
  Card,
  Box,
  Typography,
  CircularProgress,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import React, { useLayoutEffect, useState } from "react";
import { useBalance, useContract, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { parseNumber } from "../../utils";
import { coinTokenAddress, stakingAddress } from "../../contracts/address";

const GasAvailable = () => {
  const [stakeAmount, setStakeAmount] = useState("");
  const { data: airl, isLoading } = useBalance(coinTokenAddress);
  const { contract: coin } = useContract(coinTokenAddress, "token");
  const { contract: staking, refetch } = useContract(stakingAddress);
  const { mutateAsync: stake, isLoading: isStaking } = useContractWrite(
    staking,
    "stake"
  );

  useLayoutEffect(() => {
    const timer = setInterval(refetch, 10000);
    return () => clearInterval(timer);
  }, [refetch]);

  return (
    <Grid item xs={4}>
      <Card>
        <Box p={1}>
          <Typography variant="subtitle1">Available to deposit</Typography>
          <Typography variant="subtitle2" paragraph>
            {isLoading ? (
              <CircularProgress size={14} />
            ) : (
              parseNumber(Number(airl?.displayValue))
            )}{" "}
            AIRL
          </Typography>
          <Stack spacing={2}>
            <TextField
              size="small"
              focused
              label="Amount to Stake"
              variant="outlined"
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => setStakeAmount(airl?.displayValue || "")}
                    size="small"
                  >
                    MAX
                  </Button>
                ),
              }}
            />
            <Button
              color="success"
              disabled={isStaking}
              onClick={async () => {
                await coin?.erc20.setAllowance(
                  stakingAddress,
                  ethers.utils.parseEther(stakeAmount).toString()
                );

                stake({
                  args: [ethers.utils.parseEther(stakeAmount)],
                });
              }}
              size="small"
              variant="contained"
            >
              Add to Staking
            </Button>
          </Stack>
        </Box>
      </Card>
    </Grid>
  );
};

export default GasAvailable;
