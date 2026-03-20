import { useRouter } from 'next/router'
import React from 'react'
import { NextPage } from 'next'
import { useRecoilValue } from 'recoil'
import useClaimNFT from 'hooks/useClaimNFT'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AircraftShowcase from 'routes/hangar/components/AircraftShowcase'
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
      <Box py={10}>
        <Box textAlign='center' mb={6}>
          <Typography variant='h2' fontWeight={800}>
            Detalle de Aeronave
          </Typography>
        </Box>

        <Box m='auto'>
          <AircraftShowcase nft={nft} isClaiming={isLoading} hasAircraft={true} onClaim={() => claimNFT(nft)} />
        </Box>
      </Box>
    </Container>
  )
}

export default AircraftView
