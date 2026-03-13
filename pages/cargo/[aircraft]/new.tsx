import { useReadContract } from 'thirdweb/react'
import { getContract } from 'thirdweb'
import { getNFT } from 'thirdweb/extensions/erc721'
import { VaProvider } from 'context/VaProvider'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import CargoView from 'routes/Cargo/CargoView'
import Disconnected from 'components/Disconnected'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { walletStore } from 'store/wallet.atom'
import type { PageProps } from 'types'
import { ownedAircraftNftStore } from 'store/aircraftNFT.atom'

const CargoAircraft = ({ loading }: PageProps) => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const { twClient, twChain } = useRecoilValue(walletStore)
  
  const contract = useMemo(() => {
    if (!twClient || !twChain) return undefined
    return getContract({
      client: twClient,
      chain: twChain,
      address: nftAircraftTokenAddress
    })
  }, [twChain, twClient])

  const { data, isLoading } = useReadContract(getNFT, {
    contract: contract!,
    tokenId: BigInt(router.query.aircraft as string || 0)
  })

  const ownedAircrafts = useRecoilValue(ownedAircraftNftStore)
  const { live } = useLiveFlightProviderContext()

  const hasAircraft = useMemo(() => {
    if (!ownedAircrafts || !data) return false
    return ownedAircrafts.some((nft) => nft.id.toString() === data.id.toString())
  }, [ownedAircrafts, data])

  React.useEffect(() => {
    if (live) router.push('/live')
  }, [live, router])

  React.useEffect(() => {
    if (!user) {
      router.push('/cargo')
    }
  }, [user, router])

  React.useEffect(() => {
    if (!!ownedAircrafts && !!data && !isLoading && !hasAircraft) {
      router.push('/hangar')
    }
  }, [ownedAircrafts, data, isLoading, router, hasAircraft])

  if (!user) {
    return <Disconnected />
  }

  return (
    <VaProvider>
      <Fade in={isLoading || !ownedAircrafts}>
        <Box>
          <LinearProgress />
        </Box>
      </Fade>
      <Fade in={!isLoading && !!ownedAircrafts}>
        <Box>{hasAircraft ? <CargoView loading={loading} aircraft={data} /> : null}</Box>
      </Fade>
    </VaProvider>
  )
}

export default CargoAircraft
