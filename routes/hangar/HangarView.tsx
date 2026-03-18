import React, { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import useClaimNFT from 'hooks/useClaimNFT'
import Swal from 'sweetalert2'
import { useTokenProviderContext } from 'context/TokenProvider'
import AircraftItem from './components/AircraftItem'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import { INft } from 'models/Nft'
import { useNFTProviderContext } from 'components/NFTProvider'

const HangarView: React.FC = () => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const { getAirlBalance } = useTokenProviderContext()
  const { aircrafts } = useNFTProviderContext()
  const { claimAircraftNFT, isClaiming } = useClaimNFT()

  const handleClaim = useCallback(
    (aircraftNFT: INft) => async (refetch: () => void) => {
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

  if (!aircrafts) {
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
              key={aircraft.id.toString()}
              onClaim={handleClaim(aircraft)}
              isClaiming={isClaiming}
            />
          ))}
        </Grid>
      </Fade>
    </Box>
  )
}

export default HangarView
