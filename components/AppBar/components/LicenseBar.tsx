import { CircularProgress, AvatarGroup, Tooltip, Avatar } from "@mui/material";
import {
  useContract,
  useOwnedNFTs,
  MediaRenderer,
  useUser,
} from "@thirdweb-dev/react";
import { nftLicenseTokenAddress } from "contracts/address";
import React from "react";

const LicenseBar = () => {
  const { user } = useUser();
  const { contract: licenseContract } = useContract(
    nftLicenseTokenAddress,
    "edition-drop"
  );
  const { data: ownedLicense, isLoading } = useOwnedNFTs(
    licenseContract,
    user?.address
  );

  return (
    <div>
      {isLoading && user?.address ? (
        <CircularProgress size={25} />
      ) : (
        ownedLicense &&
        ownedLicense?.length > 0 && (
          <AvatarGroup>
            {ownedLicense
              .map((license) => (
                <Tooltip
                  arrow
                  title={(license.metadata.name as string).split(" - ")[1]}
                  key={license.metadata.id}
                >
                  <Avatar>
                    <MediaRenderer
                      width="50px"
                      height="50px"
                      src={license?.metadata.image}
                    />
                  </Avatar>
                </Tooltip>
              ))
              .reverse()}
          </AvatarGroup>
        )
      )}
    </div>
  );
};

export default LicenseBar;
