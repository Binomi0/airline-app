import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { MediaRenderer, useReadContract } from 'thirdweb/react'
import { getNFTAttributes } from 'utils'
import { NextPage } from 'next'
import { nftLicenseTokenAddress } from 'contracts/address'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import useClaimNFT from 'hooks/useClaimNFT'
import { getContract } from 'thirdweb'
import { getNFT, balanceOf } from 'thirdweb/extensions/erc1155'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

const maps: Record<string, string> = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '0',
  '4': '3'
}

const AircraftView: NextPage = () => {
  const router = useRouter()
  const { twClient, twChain, smartAccountAddress } = useRecoilValue(walletStore)

  const contract = useMemo(() => {
    if (!twClient || !twChain || !router.query.tokenAddress) return undefined
    return getContract({
      client: twClient,
      chain: twChain,
      address: router.query.tokenAddress as string
    })
  }, [twChain, twClient, router.query.tokenAddress])

  const licenseContract = useMemo(() => {
    if (!twClient || !twChain) return undefined
    return getContract({
      client: twClient,
      chain: twChain,
      address: nftLicenseTokenAddress
    })
  }, [twChain, twClient])

  const { claimAircraftNFT: claimNFT, isClaiming: isLoading } = useClaimNFT()

  const { data: nft, error } = useReadContract(getNFT, {
    contract: contract!,
    tokenId: BigInt((router.query.tokenId as string) || '0'),
    queryOptions: {
      enabled: !!contract && !!router.query.tokenId
    }
  })

  const { data: balance } = useReadContract(balanceOf, {
    contract: contract!,
    owner: smartAccountAddress!,
    tokenId: BigInt((router.query.tokenId as string) || '0'),
    queryOptions: {
      enabled: !!contract && !!smartAccountAddress && !!router.query.tokenId
    }
  })

  const licenseTokenId = maps[router.query.tokenId as string]
  const { data: licenseBalance } = useReadContract(balanceOf, {
    contract: licenseContract!,
    owner: smartAccountAddress!,
    tokenId: BigInt(licenseTokenId || '0'),
    queryOptions: {
      enabled: !!licenseContract && !!smartAccountAddress
    }
  })

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
                  content: `${balance && balance > 0n ? "'OWNED'" : "'LOCKED'"}`,
                  width: '50px',
                  height: '50px',
                  top: 100,
                  left: 50,
                  fontSize: '36px',
                  color: `${balance && balance > 0n ? 'green' : 'red'}`,
                  background: 'white',
                  padding: 1,
                  borderRadius: 2,
                  boxShadow: `0 0 8px 0px ${balance && balance > 0n ? 'green' : 'red'}`
                }
              }}
            >
              <MediaRenderer client={twClient!} width='100%' src={nft.metadata.image} />
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
                disabled={isLoading || (!!balance && balance > 0n)}
                variant='contained'
                onClick={() => claimNFT(nft as any)}
              >
                {licenseBalance === 0n ? 'Require licencia' : `Claim ${nft.metadata.name}`}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Box>
    </Container>
  )
}

export default AircraftView
