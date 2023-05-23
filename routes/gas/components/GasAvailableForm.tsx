import { Stack, TextField, Button, CircularProgress } from "@mui/material";
import BigNumber from "bignumber.js";
import React, { ChangeEvent } from "react";

const GasAvailableForm: React.FC<{
  max: string;
  onStake: (value: string) => void;
  loading: boolean;
}> = ({ max, onStake, loading }) => {
  const [value, setValue] = React.useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleStake() {
    const amount = new BigNumber(value);
    if (amount.isZero() || amount.isNaN() || amount.isNegative()) return;
    setValue("");
    onStake(value);
  }

  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        focused
        label="Amount to Stake"
        variant="outlined"
        type="number"
        onChange={handleChange}
        value={value}
        InputProps={{
          endAdornment: (
            <Button
              variant="contained"
              onClick={() => {
                setValue(max);
              }}
              size="small"
            >
              MAX
            </Button>
          ),
        }}
      />
      <Button
        color="success"
        disabled={loading || !value}
        onClick={handleStake}
        size="small"
        variant="contained"
      >
        {loading ? <CircularProgress size={24} /> : "Add to Staking"}
      </Button>
    </Stack>
  );
};

export default React.memo(GasAvailableForm);
