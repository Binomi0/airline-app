import { Fade, Grid, LinearProgress } from "@mui/material";
import { useAddress } from "@thirdweb-dev/react";
import { useVaProviderContext } from "context/VaProvider";
import CargoItem from "./CargoItem";
import React, { Dispatch, SetStateAction, useCallback } from "react";
import { Cargo, FRoute, Flight } from "types";

const CargoList: React.FC<{
  newCargo: (route: FRoute) => void;
  setSelected: Dispatch<SetStateAction<FRoute>>;
  flights: Flight;
}> = ({ newCargo, setSelected, flights }) => {
  const address = useAddress();

  const handleSelect = useCallback(
    (origin: string, destination: string) => {
      newCargo({ origin, destination });
      setSelected({ origin, destination });
    },
    [newCargo, setSelected]
  );

  return (
    <Fade in={Object.keys(flights).length > 0 && !!address} unmountOnExit>
      <Grid container spacing={2}>
        {Object.entries(flights as Flight).map(([key, value], index) => (
          <CargoItem
            onSelect={handleSelect}
            key={key}
            origin={key}
            flights={value}
            delay={500 * (index + 1)}
          />
        ))}
      </Grid>
    </Fade>
  );
};

export default CargoList;
