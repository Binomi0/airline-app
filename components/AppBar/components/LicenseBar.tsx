import { CircularProgress, AvatarGroup, Tooltip, Avatar } from '@mui/material'
import { MediaRenderer } from '@thirdweb-dev/react'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { nftLicenseTokenAddress } from 'contracts/address'
import useOwnedNfts from 'hooks/useOwnedNFTs'
import React from 'react'

const LicenseBar = () => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { data: ownedLicense, isLoading } = useOwnedNfts(nftLicenseTokenAddress)

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
                <Tooltip arrow title={(license?.rawMetadata?.name as string).split(' - ')[1]} key={license?.tokenId}>
                  <Avatar>
                    <MediaRenderer width='50px' height='50px' src={license?.rawMetadata?.image} />
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
