import { createContext, useContext } from "react";
import { MainContextProps } from "./MainProvider.types";

export const MainProviderContext = createContext<MainContextProps | undefined>(
  undefined
);

export const useMainProviderContext = (): MainContextProps => {
  const context = useContext(MainProviderContext);
  if (context === undefined) {
    throw new Error("useVaProviderContext must be used within a VaProvider");
  }

  return context;
};
