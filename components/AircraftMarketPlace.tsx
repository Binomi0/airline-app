import React, { useCallback } from 'react'
import { Box, Grid, Fade, CircularProgress } from '@mui/material'
import { NFT, useClaimNFT, useContract } from '@thirdweb-dev/react'
import useLicense from 'hooks/useLicense'
import { getLicenseIdFromAttributes, getNFTAttributes } from 'utils'
import useAircrafts from 'hooks/useAircrafts'
import AircraftItem from './AircraftItem'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'

const AircraftMarketPlace: React.FC = () => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const licenses = useLicense()
  const { aircrafts, isLoading } = useAircrafts()
  const { contract: aircraftContract } = useContract(nftAircraftTokenAddress)
  const { mutateAsync, isLoading: isClaiming } = useClaimNFT(aircraftContract)
  const hasLicense = useCallback(
    (aircraft: NFT) => licenses.current.get(getLicenseIdFromAttributes(getNFTAttributes(aircraft))),
    [licenses]
  )

  const handleClaim = useCallback(
    (tokenId: string) => {
      mutateAsync({ to: smartAccountAddress, quantity: 1, tokenId })
    },
    [mutateAsync, smartAccountAddress]
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
          {aircrafts.map(
            (aircraft, i) =>
              i > 0 && (
                <AircraftItem
                  nft={aircraft}
                  key={aircraft.metadata.id}
                  onClaim={handleClaim}
                  isClaiming={isClaiming}
                  hasLicense={hasLicense(aircraft)}
                />
              )
          )}
        </Grid>
      </Fade>
    </Box>
  )
}

export default AircraftMarketPlace
