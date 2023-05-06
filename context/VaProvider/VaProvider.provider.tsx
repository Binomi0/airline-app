import React, { FC, useCallback, useEffect, useReducer } from "react";
import vaProviderReducer from "./VaProvider.reducer";
import { IVAOClients } from "./VaProvider.types";
import { VaProviderContext } from "./VaProvider.context";
import axios from "axios";
import { IvaoPilot } from "types";

export const INITIAL_STATE: IVAOClients = {
  pilots: [],
  atcs: [],
  active: undefined,
};

export const VaProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(vaProviderReducer, { ...INITIAL_STATE });
  const { Provider } = VaProviderContext;

  const setClients = useCallback(
    (clients: Readonly<IVAOClients>) =>
      dispatch({ type: "SET_CLIENTS", payload: clients }),
    []
  );
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
