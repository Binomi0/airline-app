import { NFT } from "@thirdweb-dev/sdk";
import { Aircraft, Atc, Cargo, CargoDetails } from "types";

type AttributeType = {
  trait_type: string;
  value: string;
};

export const getNFTAttributes = (nft: NFT) => {
  if (
    nft.metadata.attributes &&
    Array.isArray(nft.metadata.attributes) &&
    nft.metadata.attributes.length > 0
  ) {
    return nft.metadata.attributes as AttributeType[];
  }

  return [];
};

export const parseNumber = (value: number | bigint) =>
  Intl.NumberFormat("es").format(value);

export const formatNumber = (value: number = 0, decimals: number = 2) =>
  Intl.NumberFormat("es", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(isNaN(value) ? 0 : value);

export const getDistanceByCoords = (
  atcs: Atc[],
  cargo: Pick<Cargo, "origin" | "destination">
) => {
  if (!cargo.origin) return 0;

  const originTower = atcs.find((a) => a.callsign.startsWith(cargo.origin));
  if (!originTower) return 0;

  const arrivalTower = atcs.find((a) =>
    a.callsign.startsWith(cargo.destination)
  );
  if (!arrivalTower) return 0;

  const originCoords = {
    latitude: originTower.lastTrack.latitude,
    longitude: originTower.lastTrack.longitude,
  };
  const arrivalCoords = {
    latitude: arrivalTower.lastTrack.latitude,
    longitude: arrivalTower.lastTrack.longitude,
  };
  const horizontal = Math.pow(
    arrivalCoords.longitude - originCoords.longitude,
    2
  );
  const vertical = Math.pow(arrivalCoords.latitude - originCoords.latitude, 2);
  const result = Math.sqrt(horizontal + vertical);

  return result * 100;
};

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min) / 100;
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function getCallsign() {
  const ident = Math.round(
    Math.floor(Math.random() * (10000 - 1000 + 1) + 1000)
  );
  return `${process.env.NEXT_PUBLIC_CALLSIGN}${ident}`;
}

export function getAircraftCargo(distance: number, details: CargoDetails) {
  if (distance < 700) {
    return [Aircraft.AN225, Aircraft.B737, Aircraft.C700, Aircraft.C172];
  }
  return [Aircraft.AN225, Aircraft.B737, Aircraft.C700];
}

export function getCargoWeight(aircrafts: Aircraft[]) {
  return getRandomInt(aircrafts.length);
}
