export type VaReducerState = {
  pilots: any[];
  atcs: any[];
};

export type VaContextProps = VaReducerState & {
  setClients: (clients: Readonly<VaReducerState>) => void;
};

export type IVAOClients = VaReducerState;

type SetClients = Readonly<{
  type: "SET_CLIENTS";
  payload: Readonly<IVAOClients>;
}>;

type Actions = SetClients;

export type VaReducerHandler = (
  state: VaReducerState,
  action: Actions
) => VaReducerState;
