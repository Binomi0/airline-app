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
