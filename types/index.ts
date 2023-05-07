import { atc } from "mocks";
import ivaoPilot from "mocks/ivaoPilot";

export interface AircraftAttributes {
  deposit: number;
  cargo: number;
  license: string;
}

export interface AirlineNFT {
  metadata: {
    attributes: AircraftAttributes[];
    name: string;
    description: string;
    image: string;
  };
}

export type LastTrackState =
  | "En Route"
  | "Boarding"
  | "Approach"
  | "Departing"
  | "On Blocks"
  | "Initial Climb"
  | "Landed";

export type IvaoPilot = typeof ivaoPilot;

export interface FRoute {
  origin: string;
  destination: string;
}

export type Flight = Record<string, FRoute[]>;
export type Atc = typeof atc;
