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
import { MediaRenderer, useReadContract } from 'thirdweb/react'
import { getContract } from 'thirdweb'
import { getNFT } from 'thirdweb/extensions/erc721'
import { walletStore } from 'store/wallet.atom'
import { nftLicenseTokenAddress } from 'contracts/address'
import { postApi } from 'lib/api'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import Swal from 'sweetalert2'
import { Cargo } from 'types'
import { getNFTAttributes } from 'utils'
import { useAppContracts } from 'hooks/useAppContracts'
import { twClient } from 'config'

interface AircraftAttributes {
  combustible: string
  cargo: string
  license: string
}

const CargoAircraft: React.FC<{ cargo?: Cargo; onCancel: () => void }> = ({ cargo, onCancel }) => {
  const router = useRouter()
  const { smartAccountAddress } = useRecoilValue(walletStore)
  const { licenseContract } = useAppContracts()

  const aircraftAttributes: AircraftAttributes = useMemo(() => {
    if (!cargo?.aircraft) return {} as AircraftAttributes
    const attributes = getNFTAttributes(cargo.aircraft).reduce(
      (acc, curr) =>
        ({
          ...acc,
          [curr.trait_type]: curr.value
        }) as AircraftAttributes,
      {} as AircraftAttributes
    )

    return attributes
  }, [cargo])

  const { data: license } = useReadContract(getNFT, {
    contract: licenseContract!,
    tokenId: BigInt(aircraftAttributes.license || 0)
  })

  const progressBar = useMemo(
    () => (Number(cargo?.weight) / Number(aircraftAttributes.cargo)) * 100,
    [cargo, aircraftAttributes]
  )

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
        const cargoResult = await postApi('/api/cargo/new', newCargo)
        if (!cargoResult) return
        await postApi('/api/live/new', { cargo: cargoResult })
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
      <Grid item xs={12} sm={6} key={cargo.aircraft.id.toString()}>
        <Card>
          <CardHeader
            sx={{
              alignItems: 'flex-start'
            }}
            title={cargo.aircraft.metadata.name}
            subheader={cargo.aircraft.metadata.description?.split('. ')[0]}
            avatar={
              <Avatar variant='rounded'>
                <MediaRenderer client={twClient!} width='50px' height='50px' src={cargo.aircraft.metadata.image} />
              </Avatar>
            }
            action={
              <Avatar>
                <MediaRenderer client={twClient!} width='50px' height='50px' src={license?.metadata.image} />
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
                Max Capacity: <b>{aircraftAttributes.cargo} Kg</b>
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
            <Button
              disabled={!smartAccountAddress}
              color='secondary'
              variant='contained'
              fullWidth
              onClick={handleRequestFlight}
            >
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
