import { IvaoPilot } from "types";

export type VaReducerState = {
  pilots: IvaoPilot[];
  atcs: any[];
  active?: IvaoPilot;
};

export type VaContextProps = VaReducerState & {
  setClients: (
    clients: Readonly<Pick<VaReducerState, "pilots" | "atcs">>
  ) => void;
  setCurrentPilot: (pilot?: Readonly<IvaoPilot>) => void;
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

type Actions = SetClients | SetCurrentPilot;

export type VaReducerHandler = (
  state: VaReducerState,
  action: Actions
) => VaReducerState;
