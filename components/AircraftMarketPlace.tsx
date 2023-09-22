import React, { useCallback } from 'react'
import { Box, Grid, Fade, CircularProgress } from '@mui/material'
import { NFT, useContract } from '@thirdweb-dev/react'
import useLicense from 'hooks/useLicense'
import { getLicenseIdFromAttributes, getNFTAttributes } from 'utils'
import AircraftItem from './AircraftItem'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useClaimNFT from 'hooks/useClaimNFT'
import Swal from 'sweetalert2'
import { useAircraftProviderContext } from 'context/AircraftProvider/AircraftProvider.context'
import { useTokenProviderContext } from 'context/TokenProvider'

const AircraftMarketPlace: React.FC = () => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { getAirlBalance } = useTokenProviderContext()
  const licenses = useLicense(smartAccountAddress)
  const { aircrafts, isLoading } = useAircraftProviderContext()
  const { contract: aircraftContract } = useContract(nftAircraftTokenAddress)
  const { claimAircraftNFT, isClaiming } = useClaimNFT(aircraftContract)
  const hasLicense = useCallback(
    (aircraft: NFT) => licenses.current.get(getLicenseIdFromAttributes(getNFTAttributes(aircraft))),
    [licenses]
  )

  const handleClaim = useCallback(
    (aircraftNFT: NFT) => async (refetch: () => void) => {
      console.log('handleClaim')
      if (!smartAccountAddress) {
        throw new Error('Missing account address')
      }
      const { isConfirmed } = await Swal.fire({
        title: aircraftNFT.metadata.name as string,
        text: `Do you want to get this aircraft?`,
        icon: 'question',
        showCancelButton: true
      })
      if (isConfirmed) {
        try {
          await claimAircraftNFT(aircraftNFT)
          Swal.fire({
            title: aircraftNFT.metadata.name as string,
            text: 'Claimed Aircraft! Enjoy your flights!',
            icon: 'success'
          })
          refetch()
          getAirlBalance()
        } catch (err) {
          console.error(err)
        }
      }
    },
    [claimAircraftNFT, getAirlBalance, smartAccountAddress]
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
              onClaim={handleClaim(aircraft)}
              isClaiming={isClaiming}
              hasLicense={hasLicense(aircraft)}
            />
          ))}
        </Grid>
      </Fade>
    </Box>
  )
}

export default AircraftMarketPlace
