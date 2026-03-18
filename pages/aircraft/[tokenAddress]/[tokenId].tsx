import { useRouter } from 'next/router'
import React from 'react'
import { NextPage } from 'next'
import { useRecoilValue } from 'recoil'
import useClaimNFT from 'hooks/useClaimNFT'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AircraftItem from 'routes/hangar/components/AircraftItem'
import { ownedAircraftNftStore } from 'store/aircraftNFT.atom'
import { LinearProgress } from '@mui/material'

const AircraftView: NextPage = () => {
  const router = useRouter()
  const ownedAircrafts = useRecoilValue(ownedAircraftNftStore)

  const { claimAircraftNFT: claimNFT, isClaiming: isLoading } = useClaimNFT()

  if (!ownedAircrafts?.length) return <LinearProgress />

  const nft = ownedAircrafts.find((a) => a.id.toString() === router.query.tokenId)

  if (!nft) return <LinearProgress />

  return (
    <Container>
      <Box>
        <Box textAlign='center' my={10}>
          <Typography variant='h1'>Aircraft Details</Typography>
        </Box>

        <Box maxWidth={600} m='auto'>
          <AircraftItem nft={nft} isClaiming={isLoading} onClaim={() => claimNFT(nft)} />
        </Box>
      </Box>
    </Container>
  )
}

export default AircraftView
