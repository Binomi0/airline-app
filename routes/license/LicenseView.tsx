import React, { useCallback } from 'react'
import LicenseItem from './components/LicenseItem'
import useClaimNFT from 'hooks/useClaimNFT'
import { useTokenProviderContext } from 'context/TokenProvider'
import Swal from 'sweetalert2'
import { getNFTAttributes } from 'utils'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { useRecoilValue } from 'recoil'
import { tokenBalanceStore } from 'store/balance.atom'
import { useNFTProviderContext } from 'context/NFTProvider'
import { INft } from 'models/Nft'
import useOwnedNfts from 'hooks/useOwnedNFTs'

const LicenseView: React.FC = () => {
  const { licenses } = useNFTProviderContext()
  const { data: ownedLicenses } = useOwnedNfts()
  const { claimLicenseNFT, isClaiming } = useClaimNFT()
  const { getAirlBalance } = useTokenProviderContext()
  const balance = useRecoilValue(tokenBalanceStore)

  const handleClaim = useCallback(
    (nft: INft) => async (refetch: () => void) => {
      if (!balance.airl) return

      const attribute = getNFTAttributes(nft).find((attr) => attr.trait_type === 'price')
      const { name } = nft.metadata

      const hasEnough = balance.airl !== undefined && Number(balance.airl) / 1e18 >= Number(attribute?.value || 0)
      if (hasEnough) {
        const { isConfirmed } = await Swal.fire({
          title: name as string,
          text: `Do you want to get this license for ${attribute?.value} AIRL?`,
          icon: 'question',
          showCancelButton: true,
          showConfirmButton: true
        })
        if (isConfirmed) {
          await claimLicenseNFT(nft)
          Swal.fire({
            title: name as string,
            text: 'Claimed License! New aircrafts unlocked with this license, enjoy!',
            icon: 'success'
          })
          await getAirlBalance()
          refetch()
        }
      } else {
        Swal.fire({
          title: 'Not enough tokens',
          text: `You need at least ${attribute?.value} AIRL token to claim`,
          icon: 'question'
        })
      }
    },
    [balance.airl, claimLicenseNFT, getAirlBalance]
  )

  if (!licenses)
    return (
      <Box textAlign='center'>
        <CircularProgress thickness={1} size={256} />
      </Box>
    )

  return (
    <Box my={4}>
      <Typography variant='h2'>Licenses</Typography>
      <Typography>Start with LAPL Light aviation pilot license</Typography>
      <Grid container spacing={2}>
        {licenses.map(
          (license, i) =>
            i < 4 && (
              <LicenseItem
                isClaiming={isClaiming}
                nft={license}
                claimLicenseNFT={handleClaim(license)}
                key={license.id.toString()}
                owned={ownedLicenses?.some((n) => BigInt(license.id) === BigInt(n.tokenId)) ?? false}
              />
            )
        )}
      </Grid>
    </Box>
  )
}

export default LicenseView
