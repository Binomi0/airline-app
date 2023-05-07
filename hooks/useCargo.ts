import { useVaProviderContext } from "context/VaProvider";
import { cargos } from "mocks/cargos";
import { useCallback, useMemo, useState } from "react";
import { Cargo } from "types";
import { getDistanceByCoords } from "utils";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
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

      setCargo({
        origin,
        destination,
        distance,
        details: cargos[getRandomInt(8)],
      });
    },
    [atcs]
  );

  return { newCargo, cargo };
};

export default useCargo;
