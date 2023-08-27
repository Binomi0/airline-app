import { Grid, Card, CardContent, Stack, Typography, CardActions, Button, CircularProgress } from '@mui/material'
import { NFT } from '@thirdweb-dev/react'
import React, { useCallback, useEffect } from 'react'
import { getNFTAttributes } from 'utils'
import { coinTokenAddress } from 'contracts/address'
import LicenseItemHeader from './License/LicenseItemHeader'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useTokenBalance from 'hooks/useTokenBalance'
import { Hex } from '@alchemy/aa-core'
import Swal from 'sweetalert2'

interface Props {
  nft: NFT
  owned: boolean
  isClaiming: boolean
  // eslint-disable-next-line
  claimNFT: ({ to, nft, quantity }: { to: Hex; nft: NFT; quantity: number }) => Promise<string | undefined>
}

const LicenseItem: React.FC<Props> = ({ nft, owned, claimNFT, isClaiming }) => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { balance: airlBalance, refetch: getBalance } = useTokenBalance(coinTokenAddress)
  const { name, description, image } = nft.metadata

  const attribute = getNFTAttributes(nft).find((attr) => attr.trait_type === 'price')

  const handleClaimLicense = useCallback(async () => {
    if (!airlBalance || !smartAccountAddress) return

    const balance = await getBalance()
    const hasEnough = balance.isGreaterThanOrEqualTo(attribute?.value || 0)
    if (hasEnough) {
      const { isConfirmed } = await Swal.fire({
        title: name as string,
        text: `Do you want to get this license for ${attribute?.value}?`,
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true
      })
      if (isConfirmed) {
        await claimNFT({ to: smartAccountAddress, nft, quantity: 1 })
        Swal.fire({
          title: name as string,
          text: 'Claimed License! New aircrafts unlocked with this license, enjoy!',
          icon: 'success'
        })
        getBalance()
      }
    } else {
      Swal.fire({
        title: 'Not enough tokens',
        text: `You need at least ${attribute?.value} AIRL token to claim`,
        icon: 'question'
      })
    }
  }, [airlBalance, smartAccountAddress, getBalance, attribute?.value, claimNFT, nft, name])

  const getNFTPrice = useCallback((nft: NFT) => {
    const attribute = getNFTAttributes(nft).find((attr) => attr.trait_type === 'price')
    if (!attribute) {
      throw new Error('missing types')
    }

    return attribute.value
  }, [])

  useEffect(() => {
    const timer = setInterval(getBalance, 15000)
    return () => clearInterval(timer)
  }, [getBalance])

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
            <Button
              color={airlBalance.isGreaterThan(attribute?.value || 0) ? 'success' : 'primary'}
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
