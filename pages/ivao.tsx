import React from "react";
import {
  Box,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useVaProviderContext } from "../context/VaProvider";
import { IvaoSession } from "utils/constants";
import FlightDetails from "components/FlightDetails";

const filterLEOrigins = (pilot: IvaoSession) =>
  pilot.flightPlan.departureId?.includes("LE");

const IVAOPage = () => {
  const { pilots } = useVaProviderContext();

  if (!pilots.length) {
    return <LinearProgress />;
  }

  return (
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
  );
};

export default IVAOPage;
