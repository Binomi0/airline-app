import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import MuiLink from '@mui/material/Link'
import Image from 'next/image'
import image from 'public/img/real_replica_cessna_172.png'
import styles from 'styles/Home.module.css'
import { useReadContract } from 'thirdweb/react'
import { useAppContracts } from 'hooks/useAppContracts'
import Link from 'next/link'
import Disconnected from 'components/Disconnected'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'

const maps: Record<string, string> = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '0',
  '4': '3'
}

const MissionItemPage = () => {
  const router = useRouter()
  const address = useRecoilValue(smartAccountAddressStore)
  const { aircraftContract: contract } = useAppContracts()

  const aircraftId = maps[router.query.id as string]

  const { data: balance } = useReadContract({
    contract: contract!,
    method: 'function balanceOf(address account, uint256 id) view returns (uint256)',
    params: [address!, BigInt(aircraftId || '0')],
    queryOptions: {
      enabled: !!contract && !!address && !!router.query.id
    }
  })

  const handleClick = useCallback(() => {
    console.log('HANDLE CLICK ADD MISSION?')
  }, [])

  if (!address) {
    return <Disconnected />
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Image priority className={styles.background} style={{ opacity: 0.4 }} src={image} alt='banner' fill />
      <Container>
        <Box my={6}>
          <Box>
            <Typography align='center' variant='h1'>
              Nueva Misión #{router.query.id}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Alert severity='info'>
            <AlertTitle>Aeronave recomendada: </AlertTitle>
            <Typography variant='overline'>Cessna 172 Skyhawk</Typography>
          </Alert>
        </Box>

        {balance === 0n ? (
          <Box my={2}>
            <Alert severity='warning'>
              <AlertTitle>No hay aeronave disponible</AlertTitle>
              <Typography>
                Todavía no tienes una aeronave válida para realizar esta misión. Por favor ve al
                <Link href='/hangar'>
                  <MuiLink underline='hover'> hangar </MuiLink>
                </Link>
                y adquiere una antes.
              </Typography>
            </Alert>
          </Box>
        ) : (
          <Box my={4}>
            <Typography paragraph>¡Genial! Eres el dueño de la aeronave adecuada para realizar esta misión.</Typography>
            <Button onClick={handleClick} variant='contained'>
              Empezar Vuelo
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default MissionItemPage
