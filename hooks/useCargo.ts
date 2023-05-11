import { NFT } from "@thirdweb-dev/sdk";
import { useVaProviderContext } from "context/VaProvider";
import { cargos } from "mocks/cargos";
import { useCallback, useState } from "react";
import { Cargo, FRoute } from "types";
import {
  getCallsign,
  getCargoWeight,
  getDistanceByCoords,
  getRandomInt,
  getCargoPrize,
} from "utils";

interface UseCargo {
  newCargo: (route: FRoute, owned: NFT) => void;
  cargo?: Cargo;
}

const useCargo = (): UseCargo => {
  const { atcs } = useVaProviderContext();
  const [cargo, setCargo] = useState<Cargo>();

  const newCargo = useCallback(
    (route: FRoute, aircraft: NFT) => {
      const distance = getDistanceByCoords(atcs, route);
      const details = cargos[getRandomInt(8)];
      const weight = getCargoWeight(aircraft);
      const callsign = getCallsign();
      const prize = getCargoPrize(distance, aircraft);

      setCargo({
        origin: route.origin,
        destination: route.destination,
        distance,
        details,
        aircraft,
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
