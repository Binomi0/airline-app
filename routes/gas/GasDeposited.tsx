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
import React, { useState } from "react";
import { formatNumber } from "utils";
import {
  useAddress,
  useBalance,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { rewardTokenAddress, stakingAddress } from "contracts/address";

const GasDeposited = () => {
  const address = useAddress();
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const { contract } = useContract(stakingAddress);
  const { data: staking } = useContractRead(contract, "stakers", [address]);
  const { mutateAsync: withdraw, isLoading } = useContractWrite(
    contract,
    "withdraw"
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
          <Stack spacing={2}>
            <TextField
              size="small"
              focused
              label="Amount to UnStake"
              variant="outlined"
              value={unstakeAmount}
              type="number"
              onChange={(e) => setUnstakeAmount(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() =>
                      setUnstakeAmount(
                        (Number(staking?.amountStaked) / 1e18).toString()
                      )
                    }
                    size="small"
                    variant="contained"
                  >
                    MAX
                  </Button>
                ),
              }}
            />
            <Button
              color="error"
              size="small"
              variant="contained"
              disabled={isLoading || !unstakeAmount}
              onClick={() =>
                withdraw({ args: [ethers.utils.parseEther(unstakeAmount)] })
              }
            >
              Remove from Staking
            </Button>
          </Stack>
        </Box>
      </Card>
    </Grid>
  );
};

export default GasDeposited;
