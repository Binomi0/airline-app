import React, { FC, useCallback, useEffect, useReducer } from "react";
import vaProviderReducer from "./VaProvider.reducer";
import { IVAOClients } from "./VaProvider.types";
import { VaProviderContext } from "./VaProvider.context";
import axios from "axios";
import { IvaoPilot } from "types";
import { Atc, atcs } from "mocks/atcs";

export const INITIAL_STATE: IVAOClients = {
  pilots: [],
  atcs: [],
  active: undefined,
};

type Flight = Record<string, { origin: string; destination: string }[]>;

export const VaProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(vaProviderReducer, { ...INITIAL_STATE });
  const { Provider } = VaProviderContext;

  const setClients = useCallback((clients: Readonly<IVAOClients>) => {
    // const atcs = clients.atcs.filter((atc) => atc.callsign.includes("LE"));
    const towers = clients.atcs.filter((a) => a.callsign.includes("TWR"));
    console.log("towers =>", towers);
    // console.log("spainAtcs =>", spainAtcs);
    const flights = towers.reduce((acc: Flight, curr: Atc) => {
      const others = towers.filter((a) => a.id !== curr.id);
      return {
        ...acc,
        [curr.callsign]: others.map((o) => ({
          origin: curr.callsign.split("_")[0],
          destination: o.callsign.split("_")[0],
        })),
      };
    }, {});

    console.log("flights", flights);
    dispatch({ type: "SET_CLIENTS", payload: clients });
  }, []);

  const setCurrentPilot = useCallback(
    (pilot?: Readonly<IvaoPilot>) =>
      dispatch({ type: "SET_CURRENT_PILOT", payload: pilot }),
    []
  );

  const getClients = useCallback(async () => {
    const response = await axios.get("/api/ivao/whazzup");

    setClients(response.data);
  }, [setClients]);

  useEffect(() => {
    getClients();
  }, [getClients]);

  return (
    <Provider
      value={{
        pilots: state.pilots,
        atcs: state.atcs,
        active: state.active,
        setCurrentPilot,
        setClients,
      }}
    >
      {children}
    </Provider>
  );
};
