import React from "react";
import {
  Box,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { VaProvider, useVaProviderContext } from "../context/VaProvider";
import type { IvaoPilot } from "types";
import FlightDetails from "components/FlightDetails";

const filterLEOrigins = (pilot: IvaoPilot) =>
  pilot.flightPlan.departureId?.includes("LE");

const IVAOPage = () => {
  const { pilots } = useVaProviderContext();

  if (!pilots.length) {
    return <LinearProgress />;
  }

  return (
    <VaProvider>
      <Container>
        <Box mt={10}>
          <Typography paragraph textAlign="center" variant="h1">
            IVAO ES Active Flights
          </Typography>
          <Grid container spacing={2}>
            {pilots
              .filter(filterLEOrigins)
              .slice(0, 10)
              .map((session) => (
                <FlightDetails session={session} key={session.id} />
              ))}
          </Grid>
        </Box>
      </Container>
    </VaProvider>
  );
};

export default IVAOPage;
