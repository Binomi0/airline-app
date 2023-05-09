import { Box, Fade, Typography } from "@mui/material";
import { useAddress } from "@thirdweb-dev/react";
import React from "react";

const NoAddress = () => {
  const address = useAddress();

  return (
    <Fade in={!address} unmountOnExit>
      <Box textAlign="center">
        <Typography variant="h4">
          Conecta tu wallet para selecionar un vuelo.
        </Typography>
      </Box>
    </Fade>
  );
};

export default NoAddress;
