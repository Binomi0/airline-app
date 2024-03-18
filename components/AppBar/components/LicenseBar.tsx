import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import { MediaRenderer } from '@thirdweb-dev/react'
import { useLicenseProviderContext } from 'context/LicenseProvider/LicenseProvider.context'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'

const LicenseBar = () => {
  const { ownedLicenses, isLoading } = useLicenseProviderContext()
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)

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
