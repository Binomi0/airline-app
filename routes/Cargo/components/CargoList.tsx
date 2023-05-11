import { Fade, Grid } from "@mui/material";
import { NFT, useAddress } from "@thirdweb-dev/react";
import CargoItem from "./CargoItem";
import React, { Dispatch, SetStateAction, useCallback } from "react";
import { FRoute, Flight } from "types";

const CargoList: React.FC<{
  newCargo: (route: FRoute, aircraft: NFT) => void;
  setSelected: Dispatch<SetStateAction<FRoute>>;
  flights: Flight;
  aircraft?: NFT;
}> = ({ newCargo, setSelected, flights, aircraft }) => {
  const address = useAddress();

  const handleSelect = useCallback(
    (origin: string, destination: string) => {
      if (!aircraft) {
        throw new Error("Missing aircraft");
      }
      newCargo({ origin, destination }, aircraft);
      setSelected({ origin, destination });
    },
    [newCargo, setSelected, aircraft]
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
