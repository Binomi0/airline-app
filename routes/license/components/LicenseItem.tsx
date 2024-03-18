import { NFT } from '@thirdweb-dev/react'
import React, { useCallback, useState } from 'react'
import { getNFTAttributes } from 'utils'
import LicenseItemHeader from './LicenseItemHeader'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import useLicense from 'hooks/useLicense'
import GradientCard from 'components/GradientCard'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { tokenBalanceStore } from 'store/balance.atom'

interface Props {
  nft: NFT
  owned: boolean
  isClaiming: boolean
  // eslint-disable-next-line no-unused-vars
  claimLicenseNFT: (refetch: () => void) => Promise<void>
}

const LicenseItem: React.FC<Props> = ({ nft, owned, claimLicenseNFT, isClaiming }) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const balance = useRecoilValue(tokenBalanceStore)
  const { hasLicense, refetch } = useLicense(nft.metadata.id)
  const [claimingNFT, setClaimingNFT] = useState(-1)

  const { name, description, image } = nft.metadata
  const attribute = getNFTAttributes(nft).find((attr) => attr.trait_type === 'price')

  const handleClaimLicense = useCallback(async () => {
    setClaimingNFT(Number(nft.metadata.id))
    claimLicenseNFT(refetch)
  }, [claimLicenseNFT, nft.metadata.id, refetch])

  const getNFTPrice = useCallback((nft: NFT) => {
    const attribute = getNFTAttributes(nft).find((attr) => attr.trait_type === 'price')
    if (!attribute) {
      throw new Error('missing types')
    }

    return attribute.value
  }, [])

  return (
    <Grid item xs={12} md={6} lg={4}>
      {hasLicense && (
        <Box position='relative'>
          <Box
            sx={{
              '&:before': {
                opacity: 0.1,
                fontSize: '64px',
                color: 'green',
                content: '"OWNED"',
                position: 'absolute',
                top: 80,
                left: 50,
                transform: 'rotate(345deg)'
              }
            }}
          />
        </Box>
      )}
      <GradientCard border={owned ? '3px solid green' : undefined}>
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
              color={balance.airl?.isGreaterThan(attribute?.value || 0) ? 'success' : 'primary'}
              disabled={isClaiming || !smartAccountAddress}
              variant='contained'
              onClick={handleClaimLicense}
            >
              {isClaiming && claimingNFT === Number(nft.metadata.id) ? (
                <CircularProgress size={25} />
              ) : (
                `Claim ${(nft.metadata.name as string)?.split(' - ')[1]} for ${getNFTPrice(nft)} AIRL`
              )}
            </Button>
          </CardActions>
        )}
      </GradientCard>
    </Grid>
  )
}

export default LicenseItem
