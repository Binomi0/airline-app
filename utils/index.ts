import { NFT } from "@thirdweb-dev/sdk";
import License from "pages/license";
import {
  Aircraft,
  Atc,
  AttributeType,
  Cargo,
  CargoDetails,
  IvaoPilot,
} from "types";

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
  // TODO: hardcoded value
  return "TAP1122";
  const ident = Math.round(
    Math.floor(Math.random() * (10000 - 1000 + 1) + 1000)
  );
  return `${process.env.NEXT_PUBLIC_CALLSIGN}${ident}`;
}

export function getCargoWeight(aircraft: NFT) {
  const attribute = getNFTAttributes(aircraft).find(
    (attribute) => attribute.trait_type === "cargo"
  );

  if (!attribute) {
    throw new Error("Missing attribute");
  }

  return Number(attribute.value) * randomIntFromInterval(40, 70) || 0;
}

export function getCargoPrize(distance: number, aircraft: NFT) {
  const attribute = getNFTAttributes(aircraft).find(
    (attr) => attr.trait_type === "license"
  );
  if (attribute) {
    const base = Math.floor(distance / 100);
    switch (attribute.value) {
      case "D":
        return base * (1 + randomIntFromInterval(35, 75));
      case "C":
        return base * (1 + randomIntFromInterval(35, 75) * 10);
      case "B":
        return base * (1 + randomIntFromInterval(35, 75) * 100);
      case "A":
        return base * (1 + randomIntFromInterval(35, 75) * 1000);
      default:
        return base * (1 + randomIntFromInterval(35, 75));
    }
  }
  return 0;
}

export const getLicenseIdFromAttributes = (attributes: AttributeType[]) =>
  attributes.find((attribute) => attribute.trait_type === "license")?.value ||
  "";

export const filterLEOrigins = (pilot: IvaoPilot) =>
  pilot.flightPlan.departureId?.includes("LE");
