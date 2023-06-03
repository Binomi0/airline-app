import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { MediaRenderer, useClaimNFT, useContract, useNFT, useNFTBalance, useUser } from '@thirdweb-dev/react'
import { getNFTAttributes } from 'utils'
import { NextPage } from 'next'
import { nftLicenseTokenAddress } from 'contracts/address'

const maps: Record<string, string> = {
  0: '0',
  1: '1',
  2: '2',
  3: '0',
  4: '3'
}

const AircraftView: NextPage = () => {
  const router = useRouter()
  const { user } = useUser()
  const { contract } = useContract(router.query.tokenAddress as string)
  const { contract: license } = useContract(nftLicenseTokenAddress)
  const { mutateAsync: claimNFT, isLoading } = useClaimNFT(contract)
  const { data: nft, error } = useNFT(contract, router.query.tokenId as string)
  const { data } = useNFTBalance(contract, user?.address, router.query.tokenId as string)
  const { data: licenseBalance } = useNFTBalance(license, user?.address, maps[router.query.tokenId as string])

  if (!nft) return <>Loading...</>

  return (
    <Container>
      <Box>
        {!!error && (
          <Alert severity='error'>
            <AlertTitle>Ha ocurrido un error</AlertTitle>
          </Alert>
        )}
        <Box textAlign='center' my={10}>
          <Typography variant='h1'>Aircraft Details</Typography>
        </Box>

        <Grid item xs={3}>
          <Card>
            <Box
              sx={{
                position: 'relative',
                top: 0,
                left: 0,
                '&::before': {
                  position: 'relative',
                  content: `${!data?.isZero() ? "'OWNED'" : "'LOCKED'"}`,
                  width: '50px',
                  height: '50px',
                  top: 100,
                  left: 50,
                  fontSize: '36px',
                  color: `${!data?.isZero() ? 'green' : 'red'}`,
                  background: 'white',
                  padding: 1,
                  borderRadius: 2,
                  boxShadow: `0 0 8px 0px ${!data?.isZero() ? 'green' : 'red'}`
                }
              }}
            >
              <MediaRenderer width='100%' src={nft.metadata.image} />
            </Box>
            <CardHeader title={nft.metadata.name} subheader={nft.metadata.description} />
            <CardContent>
              <Stack direction='row' justifyContent='space-between'>
                <Typography>Price</Typography>
                <Typography variant='body2'>0.01</Typography>
              </Stack>
              {getNFTAttributes(nft).map((attribute) => (
                <Stack direction='row' justifyContent='space-between' key={attribute.trait_type}>
                  <Typography>{attribute.trait_type}</Typography>
                  <Typography variant='body2'>{attribute.value}</Typography>
                </Stack>
              ))}
            </CardContent>
            <CardActions>
              <Button
                disabled={isLoading || !data?.isZero()}
                variant='contained'
                onClick={() =>
                  claimNFT({
                    to: user?.address,
                    quantity: 1,
                    tokenId: nft.metadata.id
                  })
                }
              >
                {licenseBalance?.isZero() ? 'Require licencia' : `Claim ${nft.metadata.name}`}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Box>
    </Container>
  )
}

export default AircraftView
