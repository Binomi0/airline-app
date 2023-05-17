import { useAddress, useContract, useNFTBalance } from "@thirdweb-dev/react";
import { nftAircraftTokenAddress } from "contracts/address";

const useAircraft = (id?: string) => {
  const address = useAddress();
  const { contract } = useContract(nftAircraftTokenAddress);

  const { data } = useNFTBalance(contract, address, id);

  return !data?.isZero();
};

export default useAircraft;
