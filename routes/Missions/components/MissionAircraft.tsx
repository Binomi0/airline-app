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
import { getNFT } from 'thirdweb/extensions/erc721'
import { walletStore } from 'store/wallet.atom'
import { postApi } from 'lib/api'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import Swal from 'sweetalert2'
import { Mission } from 'types'
import { getNFTAttributes } from 'utils'
import { useAppContracts } from 'hooks/useAppContracts'
import { twClient } from 'config'
import useMission from 'hooks/useMission'

interface AircraftAttributes {
  combustible: string
  cargo: string
  license: string
}

const MissionAircraft: React.FC<{ mission?: Mission; onCancel: () => void }> = ({ mission, onCancel }) => {
  const router = useRouter()
  const { smartAccountAddress } = useRecoilValue(walletStore)
  const { licenseContract } = useAppContracts()
  const { reserveMission } = useMission()

  const aircraftAttributes: AircraftAttributes = useMemo(() => {
    if (!mission?.aircraft) return {} as AircraftAttributes
    const attributes = getNFTAttributes(mission.aircraft).reduce(
      (acc, curr) =>
        ({
          ...acc,
          [curr.trait_type]: curr.value
        }) as AircraftAttributes,
      {} as AircraftAttributes
    )

    return attributes
  }, [mission])

  const { data: license } = useReadContract(getNFT, {
    contract: licenseContract!,
    tokenId: BigInt(aircraftAttributes.license || 0)
  })

  const progressBar = useMemo(
    () => (Number(mission?.weight) / Number(aircraftAttributes.cargo)) * 100,
    [mission, aircraftAttributes]
  )

  const handleRequestFlight = useCallback(async () => {
    if (!mission) return
    try {
      const { aircraft: _, ...newMissionData } = mission

      const { isConfirmed } = await Swal.fire({
        title: `Misión: ${newMissionData.callsign}`,
        text: '¿Estás listo para este vuelo? Recuerda configurar el callsign antes de empezar.',
        icon: 'question',
        showCancelButton: true
      })
      if (isConfirmed) {
        await reserveMission(mission._id!, mission.aircraft)
        router.push('/live')
      }
    } catch (err) {
      console.error(err)
    }
  }, [mission, router])

  if (!mission) {
    return <LinearProgress />
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} key={mission.aircraft.id.toString()}>
        <Card>
          <CardHeader
            sx={{
              alignItems: 'flex-start'
            }}
            title={mission.aircraft.metadata.name}
            subheader={mission.aircraft.metadata.description?.split('. ')[0]}
            avatar={
              <Avatar variant='rounded'>
                <MediaRenderer client={twClient!} width='50px' height='50px' src={mission.aircraft.metadata.image} />
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
                Peso de la misión:{' '}
                <b>
                  {Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    mission.weight || 0
                  )}{' '}
                  Kg
                </b>
              </Typography>
              <Typography textAlign='center' variant='caption'>
                Capacidad Máxima: <b>{aircraftAttributes.cargo} Kg</b>
              </Typography>
              <Typography>
                Callsign: <b>{mission.callsign}</b>
              </Typography>
              <Typography>
                Premios:{' '}
                <b>
                  {Intl.NumberFormat('en', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(mission.prize || 0)}{' '}
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

export default React.memo(MissionAircraft)
