import {
  Grid,
  Card,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";
import React, { useLayoutEffect } from "react";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { stakingAddress } from "../../contracts/address";

const GasFarmed = () => {
  const address = useAddress();
  const { contract } = useContract(stakingAddress);
  const {
    data: stakeInfo,
    isLoading,
    refetch,
  } = useContractRead(contract, "getStakeInfo", [address]);
  const { mutateAsync: claimRewards, isLoading: isClaiming } = useContractWrite(
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
          <Typography variant="subtitle1">Farmed Gasoline (AIRG)</Typography>
          {isLoading ? (
            <Box my={1} textAlign="center">
              <CircularProgress size={48} />
            </Box>
          ) : (
            <Typography variant="h3" paragraph>
              {(Number(stakeInfo?._rewards) / 1e18).toString()} Liters
            </Typography>
          )}
          <Stack>
            <Button
              color="info"
              disabled={isClaiming}
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
