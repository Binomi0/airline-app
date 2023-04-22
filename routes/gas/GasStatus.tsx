import {
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
  LinearProgress,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { parseNumber } from "../../utils";
import {
  useAddress,
  useContract,
  useBalance,
  useContractRead,
} from "@thirdweb-dev/react";
import {
  stakingAddress,
  rewardTokenAddress,
  coinTokenAddress,
} from "../../contracts/address";

const GasStatus = () => {
  const address = useAddress();
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { contract } = useContract(stakingAddress);
  const { data: gas, isLoading: gasLoading } = useBalance(rewardTokenAddress);
  const { data: airl, isLoading } = useBalance(coinTokenAddress);
  const { data: staking, isLoading: isStakingLoading } = useContractRead(
    contract,
    "getStakeInfo",
    [address]
  );
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
        <Grid item xs={3}>
          <Card>
            <Box p={1}>
              <Typography variant="subtitle1">Disponibles</Typography>
              <Typography variant="subtitle2" paragraph>
                {isLoading || !staking ? (
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
                  onChange={(e) => setStakeAmount(e.target.value)}
                />
                <Button size="small" variant="contained">
                  Add to Staking
                </Button>
              </Stack>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <Box p={1}>
              <Typography variant="subtitle1">Depositados</Typography>
              <Typography variant="subtitle2" paragraph>
                {isStakingLoading ? (
                  <CircularProgress size={14} />
                ) : (
                  parseNumber(Number(staking[0]))
                )}{" "}
                AIRL
              </Typography>
              <Stack spacing={2}>
                <TextField
                  size="small"
                  focused
                  label="Amount to withdraw"
                  variant="outlined"
                  type="number"
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <Button size="small" variant="contained">
                  Remove from Staking
                </Button>
              </Stack>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <Box p={1}>
              <Typography variant="subtitle1">Gasolina disponible</Typography>
              <Typography variant="subtitle2">
                {gasLoading ? (
                  <CircularProgress size={14} />
                ) : (
                  parseNumber(Number(gas?.displayValue))
                )}{" "}
                AIRG
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <Box p={1}>
              <Typography variant="subtitle1">Gasolinera</Typography>
              <Typography variant="subtitle2">
                Generada{" "}
                {isStakingLoading ? (
                  <CircularProgress size={14} />
                ) : (
                  parseNumber(Number(staking[1]))
                )}{" "}
                AIRG
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GasStatus;
