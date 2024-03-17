import { NFT } from '@thirdweb-dev/react'
import React, { useCallback } from 'react'
import { getLicenseIdFromAttributes, getNFTAttributes } from 'utils'
import AircraftCardHeader from './AircraftCardHeader'
import AircraftActions from './AircraftActions'
import useAircraft from 'hooks/useAircraft'
import useLicense from 'hooks/useLicense'
import GradientCard from 'components/GradientCard'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'

interface Props {
  nft: NFT
  isClaiming: boolean
  // eslint-disable-next-line no-unused-vars
  onClaim: (refetch: () => void) => void
}

const AircraftItem = ({ nft, isClaiming, onClaim }: Props) => {
  const user = useRecoilValue(userState)
  const { hasAircraft, refetch: refetchAircraft } = useAircraft(nft.metadata.id)
  const { hasLicense, refetch: refetchLicense } = useLicense(getLicenseIdFromAttributes(getNFTAttributes(nft)))

  const refetch = useCallback(() => {
    refetchAircraft()
    refetchLicense()
  }, [refetchAircraft, refetchLicense])

  const handleClaim = useCallback(() => {
    onClaim(refetch)
  }, [onClaim, refetch])

  return (
    <Grid item xs={12} lg={6}>
      <GradientCard>
        <AircraftCardHeader nft={nft} />

        <CardContent>
          {getNFTAttributes(nft).map((attribute) => (
            <Stack direction='row' justifyContent='space-between' key={attribute.trait_type}>
              <Typography>{attribute.trait_type}</Typography>
              <Typography variant='body2'>{attribute.value}</Typography>
            </Stack>
          ))}
        </CardContent>

        {user && (
          <AircraftActions
            isClaiming={isClaiming}
            name={nft.metadata.name as string}
            hasAircraft={hasAircraft}
            hasLicense={hasLicense}
            onClaim={handleClaim}
          />
        )}
      </GradientCard>
    </Grid>
  )
}

export default React.memo(AircraftItem)
