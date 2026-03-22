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
  gallonsToLiters,
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
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
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
  const router = useRouter()
  const theme = useTheme()
  const balance = useRecoilValue(tokenBalanceStore)
  const { data: userNfts } = useOwnedNFTs()
  const { twClient } = useRecoilValue(walletStore)
  const { getLive } = useLiveFlightProviderContext()
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

  const fuelRequired = useMemo(() => {
    if (!currentAircraft) return 0
    const icaoCode = getIcaoCodeFromAircraftNFT(currentAircraft.metadata.name as keyof typeof aircraftNameToIcaoCode)
    if (!icaoCode) return 0
    return getFuelForFlight(mission.distance, icaoCode)
  }, [currentAircraft, mission.distance])

  const fuelBalance = Number(balance.airg !== undefined ? Number(balance.airg) / 1e18 : 0)
  const hasEnoughFuel = fuelRequired <= fuelBalance

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

    // await reserveMission(mission._id!, currentAircraft)

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
    <Paper elevation={6} sx={{ p: 2, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
          <Typography variant='h6' fontWeight='bold'>
            ORDEN DE VUELO
          </Typography>
          <Stack direction='row' spacing={1} alignItems='center'>
            {mission.rewardMultiplier > 0.8 && (
              <Chip
                label={mission.rewardMultiplier >= 1.9 ? 'TOP MISSION' : 'BOOSTED'}
                color={mission.rewardMultiplier >= 1.9 ? 'success' : 'primary'}
                variant='filled'
                size='small'
                sx={{ fontWeight: 'bold' }}
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
              sx={{ color: 'text.secondary', borderColor: 'divider' }}
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant='overline' color='text.secondary'>
            DETALLES DE RUTA
          </Typography>
          <Stack direction='row' spacing={2} alignItems='center' mt={1}>
            <Box textAlign='center'>
              <Typography variant='h5' color={mission.originAtcOnStart ? 'info.main' : 'inherit'}>
                {mission.origin}
              </Typography>
              <Typography variant='caption' sx={{ display: 'block', mt: -0.5, fontSize: '0.7rem' }}>
                {mission.originAtcOnStart ? 'ATC ACTIVE (+40%)' : 'ORIGEN'}
              </Typography>
            </Box>
            <Box flex={1} textAlign='center' position='relative'>
              <Typography variant='body2' color='text.secondary'>
                {formatNumber(mission.distance, 0)} NM
              </Typography>
              <Box sx={{ borderBottom: '2px solid', borderColor: 'divider', my: 0.5 }} />
              <FlightTakeoffIcon
                sx={{
                  fontSize: 30,
                  color: 'primary.main',
                  opacity: 0.1,
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              />
            </Box>
            <Box textAlign='center'>
              <Typography variant='h5' color={mission.isSponsored ? 'success.main' : 'inherit'}>
                {mission.destination}
              </Typography>
              <Typography variant='caption' sx={{ display: 'block', mt: -0.5, fontSize: '0.7rem' }}>
                {mission.isSponsored ? 'ATC ACTIVE (+70%)' : 'DESTINO'}
              </Typography>
            </Box>
          </Stack>
          {mission.rewardMultiplier > 0.8 && (
            <Alert
              icon={false}
              severity='info'
              sx={{
                mt: 2,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
              }}
            >
              <Typography variant='caption' sx={{ color: 'info.main', fontWeight: 'bold' }}>
                RECOMPENSAS MEJORADAS: {Math.round((mission.rewardMultiplier - 0.8) * 100)}% BONUS POR ATC
              </Typography>
            </Alert>
          )}
        </Box>

        <Box>
          <Typography variant='overline' color='text.secondary'>
            CALLSIGN ASIGNADO
          </Typography>
          <Paper variant='outlined' sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.dark', color: 'white' }}>
            <Typography variant='h4' sx={{ letterSpacing: 4, fontWeight: 'bold' }}>
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
          <Box p={2} sx={{ bgcolor: alpha('#000', 0.05), borderRadius: 2 }}>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Box sx={{ width: 64, height: 64, borderRadius: 1, overflow: 'hidden' }}>
                <MediaRenderer client={twClient!} src={media as string} width='64px' height='64px' />
              </Box>
              <Box flex={1}>
                <Typography variant='subtitle2'>{currentAircraft.metadata.name}</Typography>
                <Typography variant='caption' color='text.secondary'>
                  Capacidad:{' '}
                  {formatNumber(
                    gallonsToLiters(
                      Number(getNFTAttributes(currentAircraft).find((a) => a.trait_type === 'combustible')?.value || 0)
                    ),
                    0
                  )}{' '}
                  L
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        <Box>
          <Stack direction='row' justifyContent='space-between' mb={1}>
            <Typography variant='body2' display='flex' alignItems='center'>
              <GasMeterIcon sx={{ mr: 1, fontSize: 18 }} /> Combustible Requerido
            </Typography>
            <Typography variant='body2' fontWeight='bold'>
              {formatNumber(fuelRequired, 0)} L
            </Typography>
          </Stack>
          <LinearProgress
            variant='determinate'
            value={Math.min(100, (fuelRequired / fuelBalance) * 100)}
            color={hasEnoughFuel ? 'success' : 'error'}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant='caption' color={hasEnoughFuel ? 'text.secondary' : 'error.main'} mt={1} display='block'>
            {hasEnoughFuel
              ? `Balance: ${formatNumber(fuelBalance, 0)} L (Suficiente)`
              : `Balance insuficiente: ${formatNumber(fuelBalance, 0)} L`}
          </Typography>
        </Box>

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
            disabled={!hasEnoughFuel || !currentAircraft}
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
