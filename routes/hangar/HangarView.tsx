import React, { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
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
import { tokenBalanceStore } from 'store/balance.atom'
import { getNFTAttributes } from 'utils'

const HangarView: React.FC = () => {
  const { aircrafts } = useNFTProviderContext()
  const { claimAircraftNFT, isClaiming } = useClaimNFT()
  const { getAirlBalance } = useTokenProviderContext()
  const balance = useRecoilValue(tokenBalanceStore)

  const handleClaim = useCallback(
    (aircraftNFT: INft) => async (refetch: () => void) => {
      if (!balance.airl) return

      const attribute = getNFTAttributes(aircraftNFT).find((attr) => attr.trait_type === 'price')
      const { name } = aircraftNFT.metadata

      const hasEnough = balance.airl !== undefined && Number(balance.airl) / 1e18 >= Number(attribute?.value || 0)
      if (!hasEnough) {
        Swal.fire({
          title: name,
          text: `You don't have enough AIRL to get this aircraft`,
          icon: 'error'
        })
        return
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
    [balance.airl, claimAircraftNFT, getAirlBalance]
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
