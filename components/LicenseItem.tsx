import { Grid, Card, CardContent, Stack, Typography, CardActions, Button, CircularProgress } from '@mui/material'
import { NFT, useBalance, useClaimNFT, useContract, useUser } from '@thirdweb-dev/react'
// import ReactGA from 'lib/analytics'
import React, { useCallback } from 'react'
import { getNFTAttributes } from 'utils'
import { nftLicenseTokenAddress } from 'contracts/address'
import { coinTokenAddress } from 'contracts/address'
import BigNumber from 'bignumber.js'
import LicenseItemHeader from './License/LicenseItemHeader'
import { event } from 'lib/gtag'

const LicenseItem: React.FC<{ nft: NFT; owned: boolean }> = ({ nft, owned }) => {
  const { user } = useUser()
  const { contract } = useContract(nftLicenseTokenAddress)
  const { mutateAsync: claimNFT, isLoading: isClaiming } = useClaimNFT(contract)
  const { data: airlBalance } = useBalance(coinTokenAddress)
  const { name, description, image } = nft.metadata

  const handleClaimLicense = useCallback(() => {
    if (!airlBalance) return

    const attribute = getNFTAttributes(nft).find((attr) => attr.trait_type === 'price')
    if (!attribute) {
      throw new Error('missing price in nft')
    }

    event({
      action: 'claim_license',
      category: 'license',
      label: `Claim License: #${nft.metadata.id}`,
      value: attribute.value.toString()
    })

    const hasEnough = new BigNumber(airlBalance.displayValue).isGreaterThan(attribute.value)
    if (hasEnough) {
      claimNFT({
        to: user?.address,
        quantity: 1,
        tokenId: nft.metadata.id
      })
    } else {
      console.log(`You do not have enough AIRL tokens, ${attribute.value}`)
    }
  }, [claimNFT, user?.address, airlBalance, nft])

  const getNFTPrice = useCallback((nft: NFT) => {
    const attribute = getNFTAttributes(nft).find((attr) => attr.trait_type === 'price')
    if (!attribute) {
      throw new Error('missing types')
    }

    return attribute.value
  }, [])

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card>
        <LicenseItemHeader
          name={name as string}
          description={description as string}
          image={image as string}
          owned={owned}
        />

        <CardContent>
          {getNFTAttributes(nft).map((attribute) => (
            <Stack direction='row' justifyContent='space-between' key={attribute.trait_type}>
              <Typography>{attribute.trait_type}</Typography>
              <Typography variant='body2'>
                {attribute.value} {attribute.trait_type === 'price' && 'AIRL'}
              </Typography>
            </Stack>
          ))}
        </CardContent>

        {!owned && (
          <CardActions>
            <Button disabled={isClaiming || !user?.address} variant='contained' onClick={handleClaimLicense}>
              {isClaiming ? (
                <CircularProgress size={25} />
              ) : (
                `Claim ${(nft.metadata.name as string)?.split(' - ')[1]} for ${getNFTPrice(nft)} AIRL`
              )}
            </Button>
          </CardActions>
        )}
      </Card>
    </Grid>
  )
}

export default LicenseItem
