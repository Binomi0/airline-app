type Actions = ToggleSidebar;
type ToggleSidebar = Readonly<{ type: "TOGGLE_SIDEBAR" }>;

export type MainReducerState = {
  sidebarOpen: boolean;
};

export type MainContextProps = MainReducerState & {
  toggleSidebar: () => void;
};

export type MainReducerHandler = (
  state: MainReducerState,
  action: Actions
) => MainReducerState;
