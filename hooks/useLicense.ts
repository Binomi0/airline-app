import { useAddress, useContract, useNFTBalance } from "@thirdweb-dev/react";
import { nftLicenseTokenAddress } from "contracts/address";
import { useEffect, useRef } from "react";

const useLicense = () => {
  const address = useAddress();
  const { contract: licenseContract } = useContract(nftLicenseTokenAddress);
  const licenses = useRef<Map<string, boolean>>(new Map());

  const licenseD = useNFTBalance(licenseContract, address, 0);
  const licenseC = useNFTBalance(licenseContract, address, 1);
  const licenseB = useNFTBalance(licenseContract, address, 2);
  const licenseA = useNFTBalance(licenseContract, address, 3);

  useEffect(() => {
    if (!licenseA || !licenseB || !licenseC || !licenseD) return;
    if (licenses.current.size === 0) {
      licenses.current.set("0", !licenseD.data?.isZero());
      licenses.current.set("1", !licenseC.data?.isZero());
      licenses.current.set("2", !licenseB.data?.isZero());
      licenses.current.set("3", !licenseA.data?.isZero());
    }
  }, [licenseA, licenseB, licenseC, licenseD]);

  return licenses;
};

export default useLicense;
