import { VaReducerHandler } from "./VaProvider.types";

export const vaProviderReducer: VaReducerHandler = (state, action) => {
  switch (action.type) {
    case "SET_CLIENTS":
      return {
        pilots: action.payload.pilots,
        atcs: action.payload.atcs.filter((atc) => atc.callsign.includes("LE")),
      };
    case "SET_CURRENT_PILOT":
      return {
        ...state,
        active: action.payload,
      };
    default:
      return state;
  }
};

export default vaProviderReducer;
