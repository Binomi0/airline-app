import { NFT } from "@thirdweb-dev/sdk";

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
