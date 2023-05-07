import { Atc, Flight, IvaoPilot } from "types";

export type VaReducerState = {
  pilots: IvaoPilot[];
  atcs: Atc[];
  active?: IvaoPilot;
  flights?: Flight;
  origins: string[];
  filter: string[];
};

export type VaContextProps = VaReducerState & {
  setClients: (clients: Readonly<IVAOClients>) => void;
  setCurrentPilot: (pilot?: Readonly<IvaoPilot>) => void;
  setFlights: (atcs: Readonly<Atc[]>) => void;
  setFilter: (value: string) => void;
};

export type IVAOClients = VaReducerState;

type SetClients = Readonly<{
  type: "SET_CLIENTS";
  payload: Readonly<IVAOClients>;
}>;
type SetCurrentPilot = Readonly<{
  type: "SET_CURRENT_PILOT";
  payload?: Readonly<IvaoPilot>;
}>;
type SetFlights = Readonly<{
  type: "SET_FLIGHTS";
  payload?: Readonly<Flight>;
}>;
type SetFilter = Readonly<{
  type: "SET_FILTER";
  payload: Readonly<string>;
}>;

type Actions = SetClients | SetCurrentPilot | SetFlights | SetFilter;

export type VaReducerHandler = (
  state: VaReducerState,
  action: Actions
) => VaReducerState;
