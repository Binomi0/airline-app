import { MainReducerHandler } from "./MainProvider.types";

export const mainProviderReducer: MainReducerHandler = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        sidebarOpen: !state.sidebarOpen,
      };
    default:
      return state;
  }
};

export default mainProviderReducer;
