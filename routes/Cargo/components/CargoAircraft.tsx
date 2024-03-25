import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {
  MediaRenderer,
  useClaimNFT,
  useContract,
  useLazyMint,
  useNFT,
  useSetClaimConditions
} from '@thirdweb-dev/react'
import axios from 'config/axios'
import { flightNftAddress, nftLicenseTokenAddress } from 'contracts/address'
import { postApi } from 'lib/api'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import Swal from 'sweetalert2'
import { Cargo } from 'types'
import { getNFTAttributes } from 'utils'

interface Aircraft {
  combustible: string
  cargo: string
  license: string
}

const CargoAircraft: React.FC<{ cargo?: Cargo; onCancel: () => void }> = ({ cargo, onCancel }) => {
  const router = useRouter()
  const address = useRecoilValue(smartAccountAddressStore)
  const { contract: flightContract } = useContract(flightNftAddress)
  const { contract: licenseContract } = useContract(nftLicenseTokenAddress)
  const { mutateAsync: lazyMint, isLoading: isMinting } = useLazyMint(flightContract)
  const { mutateAsync: claimNFT, isLoading: isClaiming } = useClaimNFT(flightContract)
  const { mutate: setClaimConditions, error } = useSetClaimConditions(flightContract)

  const aircraftAttributes: Aircraft = useMemo(() => {
    if (!cargo) return {} as Aircraft
    const attributes = getNFTAttributes(cargo?.aircraft).reduce(
      (acc, curr) =>
        ({
          ...acc,
          [curr.trait_type]: curr.value
        } as Aircraft),
      {} as Aircraft
    )

    return attributes
  }, [cargo])
  const { data: license } = useNFT(licenseContract, aircraftAttributes.license)

  const progressBar = useMemo(
    () => (Number(cargo?.weight) / Number(aircraftAttributes.cargo)) * 100,
    [cargo, aircraftAttributes]
  )

  // MOVE THIS LOGIC WHEN FLIGHT HAS FINISHED
  // const handleLazyMint = useCallback(async () => {
  //   await lazyMint({
  //     metadatas: [
  //       {
  //         name: `${cargo?.origin} - ${cargo?.destination}`,
  //         description: `User: ${address}, flight on ${Date.now()} this cargo`,
  //         image: "ipfs://QmWgvZzrNpQyyRyrEtsDUM7kyguAZurbSa2XKAHpRy415z",
  //         attributes: [{ cargo }],
  //       },
  //     ],
  //   });
  // }, [lazyMint, cargo, address]);

  // MOVE THIS LOGIC WHEN FLIGHT HAS FINISHED
  // const handleClaim = useCallback(async () => {
  //   await claimNFT({
  //     to: address,
  //     quantity: 1,
  //     tokenId: 0,
  //     options: {
  //       checkERC20Allowance: true,
  //       currencyAddress: "0x773F0e20Ab2E9afC479C82105E924C2E0Ada5aa9",
  //       pricePerToken: 0,
  //     },
  //   });
  // }, [claimNFT, address]);

  const handleRequestFlight = useCallback(async () => {
    if (!cargo) return
    try {
      const { aircraft: _, ...newCargo } = cargo

      const { isConfirmed } = await Swal.fire({
        title: `Callsign ${newCargo.callsign}`,
        text: 'Are you ready for this flight? Remember to set required callsign before start',
        icon: 'question',
        showCancelButton: true
      })
      if (isConfirmed) {
        const cargo = await postApi('/api/cargo/new', newCargo)
        if (!cargo) return
        await postApi('/api/live/new', { cargo })
        router.push('/live')
      }
    } catch (err) {
      console.error(err)
    }
  }, [cargo, router])

  if (!cargo) {
    return <LinearProgress />
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} key={cargo.aircraft.metadata.id}>
        <Card>
          <CardHeader
            sx={{
              alignItems: 'flex-start'
            }}
            title={cargo.aircraft.metadata.name}
            subheader={cargo.aircraft.metadata.description?.split('. ')[0]}
            avatar={
              <Avatar variant='rounded'>
                <MediaRenderer width='50px' height='50px' src={cargo.aircraft.metadata.image} />
              </Avatar>
            }
            action={
              <Avatar>
                <MediaRenderer width='50px' height='50px' src={license?.metadata.image} />
              </Avatar>
            }
          />
          <CardContent>
            <Stack>
              <LinearProgress color='success' variant='determinate' value={progressBar} />
              <Typography textAlign='center' variant='caption'>
                Cargo weight:{' '}
                <b>
                  {Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    cargo.weight || 0
                  )}{' '}
                  Kg
                </b>
              </Typography>
              <Typography textAlign='center' variant='caption'>
                Max Capacity: <b>{getNFTAttributes(cargo.aircraft).find((a) => a.trait_type === 'cargo')?.value} Kg</b>
              </Typography>
              <Typography>
                Callsign: <b>{cargo.callsign}</b>
              </Typography>
              <Typography>
                Rewards:{' '}
                <b>
                  {Intl.NumberFormat('en', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(cargo.prize || 0)}{' '}
                  AIRL
                </b>
              </Typography>
            </Stack>
          </CardContent>

          <CardActions>
            <Button disabled={!address} color='secondary' variant='contained' fullWidth onClick={handleRequestFlight}>
              Reservar
            </Button>
            <Button variant='contained' color='error' fullWidth onClick={onCancel}>
              cancelar
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}

export default React.memo(CargoAircraft)
