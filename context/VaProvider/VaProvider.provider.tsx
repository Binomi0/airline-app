import React, { FC, useCallback, useEffect, useReducer } from "react";
import vaProviderReducer from "./VaProvider.reducer";
import { IVAOClients } from "./VaProvider.types";
import { VaProviderContext } from "./VaProvider.context";
import axios from "axios";

export const INITIAL_STATE: IVAOClients = {
  pilots: [],
  atcs: [],
};

export const VaProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(vaProviderReducer, { ...INITIAL_STATE });
  const { Provider } = VaProviderContext;

  const setClients = useCallback(
    (clients: Readonly<IVAOClients>) =>
      dispatch({ type: "SET_CLIENTS", payload: clients }),
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
        setClients,
      }}
    >
      {children}
    </Provider>
  );
};
