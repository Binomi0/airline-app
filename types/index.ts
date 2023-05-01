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
