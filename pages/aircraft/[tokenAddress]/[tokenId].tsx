import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useReadContract } from 'thirdweb/react'
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
import AircraftItem from 'routes/hangar/components/AircraftItem'

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

        <Box maxWidth={600} m='auto'>
          <AircraftItem
            nft={nft}
            isClaiming={isLoading}
            onClaim={() => claimNFT(nft as any)}
            hasAircraft={!!balance && balance > 0n}
            hasLicense={!!licenseBalance && licenseBalance > 0n}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default AircraftView
