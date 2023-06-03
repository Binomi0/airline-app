import React, { useCallback } from 'react'
import { Box, Grid, Fade, CircularProgress } from '@mui/material'
import { useClaimNFT, useContract, useUser } from '@thirdweb-dev/react'
import useLicense from 'hooks/useLicense'
import { getLicenseIdFromAttributes, getNFTAttributes } from 'utils'
import useAircrafts from 'hooks/useAircrafts'
import AircraftItem from './AircraftItem'
import { nftAircraftTokenAddress } from 'contracts/address'

const AircraftMarketPlace: React.FC = () => {
  const { user } = useUser()
  const licenses = useLicense()
  const { aircrafts, isLoading } = useAircrafts()
  const { contract: aircraftContract } = useContract(nftAircraftTokenAddress)
  const { mutateAsync, isLoading: isClaiming } = useClaimNFT(aircraftContract)

  const handleClaim = useCallback(
    (tokenId: string) => {
      mutateAsync({ to: user?.address, quantity: 1, tokenId })
    },
    [mutateAsync, user?.address]
  )

  if (isLoading) {
    return (
      <Box textAlign='center'>
        <CircularProgress size={60} color='secondary' />
      </Box>
    )
  }
  return (
    <Box my={4}>
      <Fade in unmountOnExit>
        <Grid container spacing={6}>
          {aircrafts.map((aircraft) => (
            <AircraftItem
              nft={aircraft}
              key={aircraft.metadata.id}
              onClaim={handleClaim}
              isClaiming={isClaiming}
              hasLicense={licenses.current.get(getLicenseIdFromAttributes(getNFTAttributes(aircraft)))}
            />
          ))}
        </Grid>
      </Fade>
    </Box>
  )
}

export default AircraftMarketPlace
