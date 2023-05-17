import { useContract, useNFTs } from "@thirdweb-dev/react";
import { nftAircraftTokenAddress } from "contracts/address";

const useAircrafts = () => {
  const { contract: aircraftContract } = useContract(nftAircraftTokenAddress);
  const { data: nfts = [] } = useNFTs(aircraftContract);

  return nfts;
};

export default useAircrafts;
