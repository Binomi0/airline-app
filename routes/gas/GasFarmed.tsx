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
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { stakingAddress } from "../../contracts/address";

const GasFarmed = () => {
  const address = useAddress();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { contract } = useContract(stakingAddress);
  const { data: stakeInfo, refetch } = useContractRead(
    contract,
    "getStakeInfo",
    [address]
  );
  const { mutateAsync: claimRewards, isLoading } = useContractWrite(
    contract,
    "claimRewards"
  );

  useLayoutEffect(() => {
    const timer = setInterval(refetch, 10000);
    return () => clearInterval(timer);
  }, [refetch]);

  return (
    <Grid item xs={4}>
      <Card>
        <Box p={1}>
          <Typography variant="subtitle1">Farmed Gasoline</Typography>
          <Typography variant="subtitle2" paragraph>
            {isLoading ? (
              <CircularProgress size={14} />
            ) : (
              (Number(stakeInfo._rewards) / 1e15).toString()
            )}{" "}
            AIRG
          </Typography>
          <Stack spacing={2}>
            <TextField
              size="small"
              focused
              label="Recuperar Gasoline"
              variant="outlined"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() =>
                      setWithdrawAmount(stakeInfo?.toString() || "")
                    }
                    size="small"
                  >
                    MAX
                  </Button>
                ),
              }}
            />
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                claimRewards({ args: [] });
              }}
            >
              Get Gas
            </Button>
          </Stack>
        </Box>
      </Card>
    </Grid>
  );
};

export default GasFarmed;
