import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import MuiLink from '@mui/material/Link'
import Image from 'next/image'
import image from 'public/img/real_replica_cessna_172.png'
import styles from 'styles/Home.module.css'
import { useContract, useNFTBalance } from '@thirdweb-dev/react'
import { nftAircraftTokenAddress } from 'contracts/address'
import Link from 'next/link'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import Disconnected from 'components/Disconnected'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'

const CargoItem = () => {
  const router = useRouter()
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data } = useNFTBalance(contract, address, 1)

  const handleClick = useCallback(() => {
    console.log('HANDLE CLICK ADD CARGO?')
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
              New Cargo #{router.query.id}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Alert severity='info'>
            <AlertTitle>Recommended aircraft: </AlertTitle>
            <Typography variant='overline'>Cessna 172 Skyhawk</Typography>
          </Alert>
        </Box>

        {data?.isZero() ? (
          <Box my={2}>
            <Alert severity='warning'>
              <AlertTitle>No available aircraft</AlertTitle>
              <Typography>
                you don&apos;t have yet a valid aircraft to transport this cargo. Please go to
                <Link href='/hangar'>
                  <MuiLink underline='hover'> hangar </MuiLink>
                </Link>
                and get one before.
              </Typography>
            </Alert>
          </Box>
        ) : (
          <Box my={4}>
            <Typography paragraph>Great! You owns the right aircraft to perform this cargo flight.</Typography>
            <Button onClick={handleClick} variant='contained'>
              Start Flight
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default CargoItem
