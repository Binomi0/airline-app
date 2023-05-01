import ivaoPilot from "mocks/ivaoPilot";

export type LastTrackState =
  | "En Route"
  | "Boarding"
  | "Approach"
  | "Departing"
  | "On Blocks"
  | "Initial Climb"
  | "Landed";

export type IvaoSession = typeof ivaoPilot;
