import { useVaProviderContext } from "context/VaProvider";
import { cargos } from "mocks/cargos";
import { useCallback, useState } from "react";
import { Cargo, FRoute } from "types";
import {
  getAircraftCargo,
  getCallsign,
  getCargoWeight,
  getDistanceByCoords,
  getRandomInt,
} from "utils";

interface UseCargo {
  newCargo: (route: FRoute) => void;
  cargo?: Cargo;
}

const useCargo = (): UseCargo => {
  const { atcs } = useVaProviderContext();
  const [cargo, setCargo] = useState<Cargo>();

  const newCargo = useCallback(
    ({ origin, destination }: FRoute) => {
      const distance = getDistanceByCoords(atcs, { origin, destination });
      const details = cargos[getRandomInt(8)];
      const aircrafts = getAircraftCargo(distance, details);
      const weight = getCargoWeight(aircrafts);
      const callsign = getCallsign();
      const prize = Math.floor(distance / 100);

      setCargo({
        origin,
        destination,
        distance,
        details,
        aircrafts,
        weight,
        callsign,
        prize,
      });
    },
    [atcs]
  );

  return { newCargo, cargo };
};

export default useCargo;
