import { CircularProgress, AvatarGroup, Tooltip, Avatar } from '@mui/material'
import { useContract, useOwnedNFTs, MediaRenderer, useUser } from '@thirdweb-dev/react'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { nftLicenseTokenAddress } from 'contracts/address'
import React from 'react'

const LicenseBar = () => {
  const {smartAccountAddress} = useAlchemyProviderContext()
  const { contract: licenseContract } = useContract(nftLicenseTokenAddress, 'edition-drop')
  const { data: ownedLicense, isLoading } = useOwnedNFTs(licenseContract, smartAccountAddress)

  return (
    <div>
      {isLoading && smartAccountAddress ? (
        <CircularProgress size={25} />
      ) : (
        ownedLicense &&
        ownedLicense?.length > 0 && (
          <AvatarGroup>
            {ownedLicense
              .map((license) => (
                <Tooltip arrow title={(license.metadata.name as string).split(' - ')[1]} key={license.metadata.id}>
                  <Avatar>
                    <MediaRenderer width='50px' height='50px' src={license?.metadata.image} />
                  </Avatar>
                </Tooltip>
              ))
              .reverse()}
          </AvatarGroup>
        )
      )}
    </div>
  )
}

export default LicenseBar
