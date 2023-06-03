import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material'
import {
  MediaRenderer,
  useAddress,
  useClaimNFT,
  useContract,
  useLazyMint,
  useNFT,
  useSetClaimConditions
} from '@thirdweb-dev/react'
import axios from 'axios'
import { flightNftAddress, nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'
import { Cargo } from 'types'
import { getNFTAttributes } from 'utils'

interface Aircraft {
  combustible: string
  cargo: string
  license: string
}

const CargoAircraft: React.FC<{ cargo?: Cargo; onCancel: () => void }> = ({ cargo, onCancel }) => {
  const router = useRouter()
  const address = useAddress()
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
    await axios.post('/api/cargo/new', cargo)
    router.push('/live')
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
                Cargo weight: <b>{Intl.NumberFormat('en').format(cargo.weight)} Kg</b>
              </Typography>
              <Typography textAlign='center' variant='caption'>
                Max Capacity: <b>{getNFTAttributes(cargo.aircraft).find((a) => a.trait_type === 'cargo')?.value} Kg</b>
              </Typography>
              <Typography>
                Callsign: <b>{cargo?.callsign}</b>
              </Typography>
              <Typography>
                Prize:{' '}
                <b>
                  {Intl.NumberFormat('en', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(cargo?.prize || 0)}{' '}
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
