import { Typography, CircularProgress } from "@mui/material";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { stakingAddress } from "contracts/address";
import { memo, useEffect } from "react";
import { formatNumber } from "utils";

const GasSupply = () => {
  const { contract } = useContract(stakingAddress);
  const { data, isLoading, refetch } = useContractRead(
    contract,
    "getRewardTokenBalance"
  );

  useEffect(() => {
    const timer = setInterval(refetch, 60000);
    return () => clearInterval(timer);
  }, [refetch]);

  return (
    <Typography paragraph>
      Available:{" "}
      {isLoading ? (
        <CircularProgress size={14} />
      ) : (
        formatNumber(Number(data?.toString()) / 1e18)
      )}{" "}
      Liters
    </Typography>
  );
};

export default memo(GasSupply);
