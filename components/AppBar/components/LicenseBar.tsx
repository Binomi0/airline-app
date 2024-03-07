import { CircularProgress, AvatarGroup, Tooltip, Avatar } from '@mui/material'
import { MediaRenderer } from '@thirdweb-dev/react'
import { useLicenseProviderContext } from 'context/LicenseProvider/LicenseProvider.context'
import React from 'react'

interface Props {
  smartAccountAddress?: string
}

const LicenseBar = ({ smartAccountAddress }: Props) => {
  const { ownedLicenses, isLoading } = useLicenseProviderContext()

  return (
    <div>
      {isLoading && !smartAccountAddress ? (
        <CircularProgress size={24} />
      ) : (
        ownedLicenses &&
        ownedLicenses?.length > 0 && (
          <AvatarGroup>
            {ownedLicenses
              .map((license) => (
                <Tooltip arrow title={(license?.metadata?.name as string).split(' - ')[1]} key={license?.metadata.id}>
                  <Avatar>
                    <MediaRenderer width='50px' height='50px' src={license?.metadata?.image} />
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
