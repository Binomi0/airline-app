import React from 'react'
import dynamic from 'next/dynamic'
const OperationsCenter = dynamic(() => import('routes/Missions/OperationsCenter'), { ssr: false })
import { VaProvider } from 'context/VaProvider'
import Disconnected from 'components/Disconnected'
import { useRouter } from 'next/router'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import LinearProgress from '@mui/material/LinearProgress'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import useOwnedNfts from 'hooks/useOwnedNFTs'

const MissionsPage = () => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const { data: userNfts, isLoading } = useOwnedNfts()
  const { live } = useLiveFlightProviderContext()

  React.useEffect(() => {
    if (live) router.push('/live')
  }, [live, router])

  if (!user) {
    return <Disconnected />
  }

  if (isLoading) {
    return <LinearProgress />
  }

  if (userNfts?.length === 0) {
    return (
      <Container>
        <Stack height='calc(100vh - 64px)' alignItems='center' justifyContent='center' spacing={2}>
          <Typography variant='h4'>Tienes que tener al menos 1 aeronave para acceder a esta sección.</Typography>
          <Button variant='contained' onClick={() => router.push('/hangar')}>
            Ir al Hangar
          </Button>
        </Stack>
      </Container>
    )
  }

  return (
    <VaProvider>
      <OperationsCenter />
    </VaProvider>
  )
}

export default MissionsPage
