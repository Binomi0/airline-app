import { VaReducerHandler } from "./VaProvider.types";

export const vaProviderReducer: VaReducerHandler = (state, action) => {
  switch (action.type) {
    case "SET_CLIENTS":
      return {
        pilots: action.payload.pilots,
        atcs: action.payload.atcs.filter((atc) => atc.callsign.includes("LE")),
      };
    default:
      return state;
  }
};

export default vaProviderReducer;
