import { Grid, Card, CardContent, Stack, Typography, CardActions, Button, CircularProgress } from '@mui/material'
import { NFT } from '@thirdweb-dev/react'
import React, { useCallback } from 'react'
import { getNFTAttributes } from 'utils'
import LicenseItemHeader from './License/LicenseItemHeader'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useLicense from 'hooks/useLicense'
import { useTokenProviderContext } from 'context/TokenProvider'

interface Props {
  nft: NFT
  owned: boolean
  isClaiming: boolean
  // eslint-disable-next-line no-unused-vars
  claimLicenseNFT: (refetch: () => void) => Promise<void>
}

const LicenseItem: React.FC<Props> = ({ nft, owned, claimLicenseNFT, isClaiming }) => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const {airl} = useTokenProviderContext()
  const { hasLicense, refetch } = useLicense(nft.metadata.id)

  const { name, description, image } = nft.metadata
  const attribute = getNFTAttributes(nft).find((attr) => attr.trait_type === 'price')

  const handleClaimLicense = useCallback(async () => {
    claimLicenseNFT(refetch)
  }, [claimLicenseNFT, refetch])

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

        {smartAccountAddress && !hasLicense && (
          <CardActions>
            <Button
              color={airl?.isGreaterThan(attribute?.value || 0) ? 'success' : 'primary'}
              disabled={isClaiming || !smartAccountAddress}
              variant='contained'
              onClick={handleClaimLicense}
            >
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
