import {
  Fade,
  Grid,
  Stack,
  Box,
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useAddress } from "@thirdweb-dev/react";
import React from "react";
import CargoAircraft from "routes/Cargo/components/CargoAircraft";
import { Cargo } from "types";

const CargoReady: React.FC<{
  cargo?: Cargo;
  onCancel: () => void;
}> = ({ cargo, onCancel }) => {
  const address = useAddress();

  return (
    <Fade in={!!cargo && !!address} unmountOnExit>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h2">{cargo?.origin}</Typography>
            </Box>
            <Box
              sx={{
                height: 24,
                background: "white",
                p: 0,
                mx: 2,
                flex: 1,
                textAlign: "center",
                borderRadius: 10,
              }}
            >
              <Typography
                color="common.black"
                fontWeight={700}
                // color="primary.main"
                letterSpacing={2}
              >
                {Intl.NumberFormat("es", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(cargo?.distance || 0)}{" "}
                km
              </Typography>
            </Box>
            <Box>
              <Typography variant="h2">{cargo?.destination}</Typography>
            </Box>
          </Stack>
          <Box my={4}>
            <Alert severity="info">
              <AlertTitle>Cargo: {cargo?.details?.name}</AlertTitle>
              <Typography variant="subtitle2">
                {cargo?.details?.description}
              </Typography>
            </Alert>
          </Box>

          <Box my={4}>
            <CargoAircraft cargo={cargo} onCancel={onCancel} />
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};

export default CargoReady;
