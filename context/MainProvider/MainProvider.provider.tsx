import React, { FC, useCallback, useReducer } from "react";
import MainProviderReducer from "./MainProvider.reducer";
import { MainProviderContext } from "./MainProvider.context";
import { MainReducerState } from "./MainProvider.types";

export const INITIAL_STATE: MainReducerState = {
  sidebarOpen: false,
};

export const MainProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(MainProviderReducer, {
    ...INITIAL_STATE,
  });
  const { Provider } = MainProviderContext;

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  }, []);

  return (
    <Provider
      value={{
        sidebarOpen: state.sidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </Provider>
  );
};
