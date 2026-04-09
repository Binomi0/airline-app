import React, { useCallback, useMemo, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  LinearProgress,
  Chip,
  alpha,
  useTheme
} from '@mui/material'
import { PublicMission, MissionCategory, aircraftNameToIcaoCode } from 'types'
import {
  formatNumber,
  getFuelForFlight,
  getIcaoCodeFromAircraftNFT,
  getNFTAttributes,
  filterByTokenAddress
} from 'utils'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useRecoilValue } from 'recoil'
import { tokenBalanceStore } from 'store/balance.atom'
import { INft } from 'models/Nft'
import { MediaRenderer } from 'thirdweb/react'
import { walletStore } from 'store/wallet.atom'
import useOwnedNFTs from 'hooks/useOwnedNFTs'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import GasMeterIcon from '@mui/icons-material/GasMeter'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import useMission from 'hooks/useMission'

interface FlightDispatchProps {
  mission: PublicMission
  onCancel: () => void
}

const aircraftImageMap = [
  '/img/aircrafts/C172.png',
  '/img/aircrafts/C700.png',
  '/img/aircrafts/B737.png',
  '/img/aircrafts/AN225.png'
]

const FlightDispatch: React.FC<FlightDispatchProps> = ({ mission, onCancel }) => {
  const theme = useTheme()
  const router = useRouter()
  const balance = useRecoilValue(tokenBalanceStore)
  const { data: userNfts } = useOwnedNFTs()
  const { twClient } = useRecoilValue(walletStore)
  const { reserveMission } = useMission()

  const ownedAircrafts = useMemo(
    () => userNfts?.filter(filterByTokenAddress(nftAircraftTokenAddress)) || [],
    [userNfts]
  )

  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('')

  // Automatically select the first aircraft when the list loads
  React.useEffect(() => {
    if (ownedAircrafts.length > 0 && !selectedAircraftId) {
      setSelectedAircraftId(ownedAircrafts[0].nft.id.toString())
    }
  }, [ownedAircrafts, selectedAircraftId])

  const media = aircraftImageMap[selectedAircraftId as keyof typeof aircraftImageMap]

  const currentAircraft = useMemo(
    () => ownedAircrafts.find((a) => a.nft?.id.toString() === selectedAircraftId)?.nft as INft,
    [ownedAircrafts, selectedAircraftId]
  )
  const maxFuelCapacity = useMemo(
    () =>
      currentAircraft &&
      Number(getNFTAttributes(currentAircraft).find((a) => a.trait_type === 'combustible')?.value || 0),
    [currentAircraft]
  )

  const fuelRequired = useMemo(() => {
    if (!currentAircraft) return 0
    const icaoCode = getIcaoCodeFromAircraftNFT(currentAircraft.metadata.name as keyof typeof aircraftNameToIcaoCode)
    if (!icaoCode) return 0
    return getFuelForFlight(mission.distance, icaoCode)
  }, [currentAircraft, mission.distance])

  const fuelBalance = Number(balance.airg !== undefined ? Number(balance.airg) / 1e18 : 0)
  const hasEnoughFuel = fuelBalance >= fuelRequired
  const hasFuelCapacity = fuelBalance <= maxFuelCapacity

  const handleAircraftChange = (event: SelectChangeEvent) => {
    setSelectedAircraftId(event.target.value as string)
  }

  const handleBookFlight = useCallback(async () => {
    if (!currentAircraft) return

    const { isConfirmed } = await Swal.fire({
      title: `CALLSIGN: ${mission.callsign}`,
      text: `¿Estás listo para volar a ${mission.destination}? Asegúrate de configurar el callsign en tu simulador.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡vamos!',
      cancelButtonText: 'Cancelar'
    })

    if (isConfirmed) {
      try {
        await reserveMission(mission._id!, currentAircraft)
        router.push('/live')
      } catch (error) {
        console.error('Error booking flight:', error)
        Swal.fire('Error', 'No se pudo reservar el vuelo. Intenta de nuevo.', 'error')
      }
    }
  }, [mission, currentAircraft, router, reserveMission])

  return (
    <Paper variant='dispatch' elevation={6}>
      <Stack spacing={2}>
        <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
          <Typography variant='h6' style={{ fontWeight: 'bold' }}>
            ORDEN DE VUELO
          </Typography>
          <Stack direction='row' spacing={1} alignItems='center'>
            {mission.rewardMultiplier > 0.8 && (
              <Chip
                label={mission.rewardMultiplier >= 1.9 ? 'TOP MISSION' : 'BOOSTED'}
                color={mission.rewardMultiplier >= 1.9 ? 'success' : 'primary'}
                variant='filled'
                size='small'
                style={{ fontWeight: 'bold' }}
              />
            )}
            <Chip
              label={
                mission.category === MissionCategory.SOLO
                  ? 'SOLO MISSION'
                  : mission.rewardMultiplier >= 1.9
                    ? 'DUAL ATC COVERAGE'
                    : 'ATC COVERAGE'
              }
              variant='outlined'
              size='small'
              style={{ color: theme.palette.text.secondary, borderColor: theme.palette.divider }}
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant='overline' color='text.secondary'>
            DETALLES DE RUTA
          </Typography>
          <Box style={{ marginTop: theme.spacing(1) }}>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Box style={{ textAlign: 'center' }}>
                <Typography
                  variant='h5'
                  style={{ color: mission.originAtcOnStart ? theme.palette.info.main : 'inherit' }}
                >
                  {mission.origin}
                </Typography>
                <Typography variant='caption' style={{ display: 'block', marginTop: -4, fontSize: '0.7rem' }}>
                  {mission.originAtcOnStart ? 'ATC ACTIVE (+40%)' : 'ORIGEN'}
                </Typography>
              </Box>
              <Box style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                <Typography variant='body2' color='text.secondary'>
                  {formatNumber(mission.distance, 0)} NM
                </Typography>
                <Box style={{ borderBottom: `2px solid ${theme.palette.divider}`, marginTop: 4, marginBottom: 4 }} />
                <FlightTakeoffIcon
                  style={{
                    fontSize: 30,
                    color: theme.palette.primary.main,
                    opacity: 0.1,
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                />
              </Box>
              <Box style={{ textAlign: 'center' }}>
                <Typography
                  variant='h5'
                  style={{ color: mission.isSponsored ? theme.palette.success.main : 'inherit' }}
                >
                  {mission.destination}
                </Typography>
                <Typography variant='caption' style={{ display: 'block', marginTop: -4, fontSize: '0.7rem' }}>
                  {mission.isSponsored ? 'ATC ACTIVE (+70%)' : 'DESTINO'}
                </Typography>
              </Box>
            </Stack>
          </Box>
          {mission.rewardMultiplier > 0.8 && (
            <Alert
              icon={false}
              severity='info'
              style={{
                marginTop: theme.spacing(2),
                backgroundColor: alpha(theme.palette.info.main, 0.05),
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
              }}
            >
              <Typography variant='caption' style={{ color: theme.palette.info.main, fontWeight: 'bold' }}>
                RECOMPENSAS MEJORADAS: {Math.round((mission.rewardMultiplier - 0.8) * 100)}% BONUS POR ATC
              </Typography>
            </Alert>
          )}
        </Box>

        <Box>
          <Typography variant='overline' color='text.secondary'>
            CALLSIGN ASIGNADO
          </Typography>
          <Paper
            variant='outlined'
            style={{
              padding: theme.spacing(1),
              textAlign: 'center',
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.common.white
            }}
          >
            <Typography variant='h4' style={{ letterSpacing: 4, fontWeight: 'bold' }}>
              {mission.callsign}
            </Typography>
          </Paper>
        </Box>

        <FormControl fullWidth>
          <InputLabel id='aircraft-selector-label'>Tu Aeronave</InputLabel>
          <Select
            labelId='aircraft-selector-label'
            value={selectedAircraftId}
            label='Tu Aeronave'
            onChange={handleAircraftChange}
          >
            {ownedAircrafts.map((owned) => (
              <MenuItem key={owned.nft.id.toString()} value={owned.nft.id.toString()}>
                {owned.nft.metadata.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {currentAircraft && (
          <Box
            style={{
              padding: theme.spacing(2),
              backgroundColor: alpha(theme.palette.common.black, 0.05),
              borderRadius: theme.spacing(2)
            }}
          >
            <Stack direction='row' spacing={2} alignItems='center'>
              <Box style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden' }}>
                <MediaRenderer client={twClient!} src={media as string} width='64px' height='64px' />
              </Box>
              <Box flex={1}>
                <Typography variant='subtitle2'>{currentAircraft.metadata.name}</Typography>
                <Typography variant='caption' color='text.secondary'>
                  Capacidad: {formatNumber(maxFuelCapacity, 0)} L
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {hasFuelCapacity ? (
          <Box>
            <Stack direction='row' justifyContent='space-between' mb={1}>
              <Typography variant='body2' display='flex' alignItems='center'>
                <GasMeterIcon style={{ marginRight: 8, fontSize: 18 }} /> Combustible Requerido
              </Typography>
              <Typography variant='body2' style={{ fontWeight: 'bold' }}>
                {formatNumber(fuelRequired, 0)} L
              </Typography>
            </Stack>
            <LinearProgress
              variant='determinate'
              value={Math.min(100, (fuelRequired / fuelBalance) * 100)}
              color={hasEnoughFuel ? 'success' : 'error'}
              style={{ height: 8, borderRadius: 4 }}
            />
            <Typography
              variant='caption'
              style={{
                color: hasEnoughFuel ? theme.palette.text.secondary : theme.palette.error.main,
                marginTop: 8,
                display: 'block'
              }}
            >
              {hasEnoughFuel
                ? `Balance: ${formatNumber(fuelBalance, 0)} L (Suficiente)`
                : `Balance insuficiente: ${formatNumber(fuelBalance, 0)} L`}
            </Typography>
          </Box>
        ) : (
          <Alert severity='warning'>
            <Typography color='warning.main' variant='body2' textAlign='center'>
              Has excedido la capacidad de combustible de tu aeronave. Por favor, selecciona otra aeronave.
            </Typography>
          </Alert>
        )}

        {!hasEnoughFuel && (
          <Alert severity='warning'>
            <Typography variant='body2'>
              No tienes suficiente <b>AIRG</b> para este vuelo.
            </Typography>
            <Button size='small' variant='text' onClick={() => router.push('/gas')}>
              Recargar Gas
            </Button>
          </Alert>
        )}

        <Stack direction='row' spacing={2}>
          <Button fullWidth variant='outlined' color='inherit' onClick={onCancel}>
            CAMBIAR
          </Button>
          <Button
            fullWidth
            variant='contained'
            size='large'
            disabled={!hasEnoughFuel || !currentAircraft || !hasFuelCapacity}
            onClick={handleBookFlight}
          >
            DESPACHAR VUELO
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default FlightDispatch
