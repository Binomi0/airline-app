import { Grid, LinearProgress } from "@mui/material";
import FlightDetails from "components/FlightDetails";
import { useVaProviderContext } from "context/VaProvider";
import React from "react";
import { filterLEOrigins } from "utils";

const IvaoView = () => {
  const { pilots } = useVaProviderContext();

  if (!pilots.length) {
    return <LinearProgress />;
  }

  return (
    <Grid container spacing={2}>
      {pilots
        .filter(filterLEOrigins)
        .slice(0, 10)
        .map((session) => (
          <FlightDetails session={session} key={session.id} />
        ))}
    </Grid>
  );
};

export default IvaoView;
