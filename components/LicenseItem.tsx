import { Grid, Card, CardContent, Stack, Typography, CardActions, Button, CircularProgress } from '@mui/material'
import { NFT, useContract } from '@thirdweb-dev/react'
import React, { useCallback } from 'react'
import { getNFTAttributes } from 'utils'
import { nftLicenseTokenAddress } from 'contracts/address'
import { coinTokenAddress } from 'contracts/address'
import LicenseItemHeader from './License/LicenseItemHeader'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useTokenBalance from 'hooks/useTokenBalance'
import useClaimNFT from 'hooks/useClaimNFT'

const LicenseItem: React.FC<{ nft: NFT; owned: boolean }> = ({ nft, owned }) => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { contract } = useContract(nftLicenseTokenAddress)
  const { claimNFT, isClaiming } = useClaimNFT(contract)
  const { balance: airlBalance } = useTokenBalance(coinTokenAddress)
  const { name, description, image } = nft.metadata

  const handleClaimLicense = useCallback(() => {
    console.log('handleClaimLicense')
    if (!airlBalance || !smartAccountAddress) return
    console.log('handleClaimLicense 2', airlBalance.toString())

    const attribute = getNFTAttributes(nft).find((attr) => attr.trait_type === 'price')
    if (!attribute) {
      throw new Error('missing price in nft')
    }
    console.log('handleClaimLicense 3')

    const hasEnough = airlBalance.isGreaterThan(attribute.value)
    console.log({ hasEnough })
    if (hasEnough) {
      claimNFT({ to: smartAccountAddress, nft, quantity: 1 })
    } else {
      console.log(`You do not have enough AIRL tokens, ${attribute.value}`)
    }
  }, [claimNFT, smartAccountAddress, airlBalance, nft])

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
            <Button disabled={isClaiming || !smartAccountAddress} variant='contained' onClick={handleClaimLicense}>
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
