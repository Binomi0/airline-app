import React, { useCallback } from 'react'
import { Box, Grid, Fade, CircularProgress } from '@mui/material'
import { NFT, useContract } from '@thirdweb-dev/react'
import useLicense from 'hooks/useLicense'
import { getLicenseIdFromAttributes, getNFTAttributes } from 'utils'
import useAircrafts from 'hooks/useAircrafts'
import AircraftItem from './AircraftItem'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useClaimNFT from 'hooks/useClaimNFT'

const mapLicenseFromAircraft = (license: string) => {
  switch (license) {
    case 'A':
      return '3'
    case 'B':
      return '2'
    case 'C':
      return '1'
    case 'D':
      return '0'
    default:
      return ''
  }
}

const AircraftMarketPlace: React.FC = () => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const licenses = useLicense(smartAccountAddress)
  const { aircrafts, isLoading } = useAircrafts()
  const { contract: aircraftContract } = useContract(nftAircraftTokenAddress)
  const { claimAircraftNFT, isClaiming } = useClaimNFT(aircraftContract)
  const hasLicense = useCallback(
    (aircraft: NFT) =>
      licenses.current.get(mapLicenseFromAircraft(getLicenseIdFromAttributes(getNFTAttributes(aircraft)))),
    [licenses]
  )

  const handleClaim = useCallback(
    (aircraftNFT: NFT) => {
      if (!smartAccountAddress) {
        throw new Error('Missing account address')
      }
      claimAircraftNFT({ to: smartAccountAddress, quantity: 1, nft: aircraftNFT })
    },
    [claimAircraftNFT, smartAccountAddress]
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
                  onClaim={() => handleClaim(aircraft)}
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
