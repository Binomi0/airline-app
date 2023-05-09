import { useVaProviderContext } from "context/VaProvider";
import { cargos } from "mocks/cargos";
import { useCallback, useMemo, useState } from "react";
import { Aircraft, Cargo, CargoDetails } from "types";
import { getDistanceByCoords } from "utils";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function getAircraftCargo(distance: number, details: CargoDetails) {
  if (distance < 700) {
    return [Aircraft.AN225, Aircraft.B737, Aircraft.C700, Aircraft.C172];
  }
  return [Aircraft.AN225, Aircraft.B737, Aircraft.C700];
}

function getCargoWeight(aircrafts: Aircraft[]) {
  const aircraft = getRandomInt(aircrafts.length);

  return aircraft;
}

interface UseCargo {
  newCargo: (origin: string, destination: string) => void;
  cargo?: Cargo;
}

const useCargo = (): UseCargo => {
  const { atcs } = useVaProviderContext();
  const [cargo, setCargo] = useState<Cargo>();

  const newCargo = useCallback(
    (origin: string, destination: string) => {
      const distance = getDistanceByCoords(atcs, { origin, destination });

      const details = cargos[getRandomInt(8)];
      const aircrafts = getAircraftCargo(distance, details);
      const weight = getCargoWeight(aircrafts);

      setCargo({
        origin,
        destination,
        distance,
        details,
        aircrafts,
        weight,
      });
    },
    [atcs]
  );

  return { newCargo, cargo };
};

export default useCargo;
