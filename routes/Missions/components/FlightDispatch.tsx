import React, { useCallback, useMemo, useState } from 'react'
import { 
  Box, Paper, Typography, Stack, Button, Divider, 
  Alert, AlertTitle, Select, MenuItem, FormControl, 
  InputLabel, SelectChangeEvent, LinearProgress, Chip,
  alpha
} from '@mui/material'
import { Mission, MissionCategory, aircraftNameToIcaoCode } from 'types'
import { formatNumber, getFuelForFlight, getIcaoCodeFromAircraftNFT, getMissionAttributes, gallonsToLiters, filterByTokenAddress } from 'utils'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useRecoilValue, useRecoilState } from 'recoil'
import { tokenBalanceStore } from 'store/balance.atom'
import { ownedAircraftNftStore, aircraftNftStore } from 'store/aircraftNFT.atom'
import { INft } from 'models/Nft'
import { IUserNftPopulated } from 'models/UserNft'
import { MediaRenderer } from 'thirdweb/react'
import { walletStore } from 'store/wallet.atom'
import useOwnedNFTs from 'hooks/useOwnedNFTs'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import GasMeterIcon from '@mui/icons-material/GasMeter'
import { postApi } from 'lib/api'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

interface FlightDispatchProps {
  mission: Mission
  onCancel: () => void
}

const FlightDispatch: React.FC<FlightDispatchProps> = ({ mission, onCancel }) => {
  const router = useRouter()
  const balance = useRecoilValue(tokenBalanceStore)
  const { data: userNfts } = useOwnedNFTs()
  const { twClient } = useRecoilValue(walletStore)
  const { getLive } = useLiveFlightProviderContext()
  
  const ownedAircrafts = useMemo(() => 
    userNfts?.filter(filterByTokenAddress(nftAircraftTokenAddress)) || [], 
    [userNfts]
  )
  
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>(ownedAircrafts[0]?.nft?.id.toString() || '')

  const currentAircraft = useMemo(() => 
    ownedAircrafts.find(a => a.nft?.id.toString() === selectedAircraftId)?.nft, 
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
      title: `Confirmar Despacho: ${mission.callsign}`,
      text: `¿Estás listo para volar a ${mission.destination}? Asegúrate de configurar el callsign en tu simulador.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡vamos!',
      cancelButtonText: 'Cancelar'
    })

    if (isConfirmed) {
      try {
        const payload = {
          ...mission,
          aircraftId: selectedAircraftId
        }
        const missionResult = await postApi('/api/missions/new', payload)
        if (!missionResult) return
        
        await postApi('/api/live/new', { mission: missionResult })
        await getLive()
        router.push('/live')
      } catch (error) {
        console.error('Error booking flight:', error)
        Swal.fire('Error', 'No se pudo reservar el vuelo. Intenta de nuevo.', 'error')
      }
    }
  }, [mission, currentAircraft, selectedAircraftId, getLive, router])

  return (
    <Paper elevation={6} sx={{ p: 4, borderRadius: 3, position: 'sticky', top: 24 }}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h5" fontWeight="bold">ORDEN DE VUELO</Typography>
          <Chip 
            label={mission.category === MissionCategory.ATC ? "ATC SPONSORED" : "SOLO MISSION"} 
            color={mission.category === MissionCategory.ATC ? "success" : "default"}
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" color="text.secondary">DETALLES DE RUTA</Typography>
          <Stack direction="row" spacing={2} alignItems="center" mt={1}>
            <Box textAlign="center">
              <Typography variant="h4">{mission.origin}</Typography>
              <Typography variant="caption">ORIGEN</Typography>
            </Box>
            <Box flex={1} textAlign="center" position="relative">
              <Typography variant="body2" color="text.secondary">{formatNumber(mission.distance, 0)} NM</Typography>
              <Box sx={{ borderBottom: '2px solid', borderColor: 'divider', my: 1 }} />
              <FlightTakeoffIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.1, position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
            </Box>
            <Box textAlign="center">
              <Typography variant="h4">{mission.destination}</Typography>
              <Typography variant="caption">DESTINO</Typography>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Typography variant="overline" color="text.secondary">CALLSIGN ASIGNADO</Typography>
          <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.dark', color: 'white' }}>
            <Typography variant="h3" sx={{ letterSpacing: 4, fontWeight: 'bold' }}>
              {mission.callsign}
            </Typography>
          </Paper>
        </Box>

        <FormControl fullWidth>
          <InputLabel id="aircraft-selector-label">Tu Aeronave</InputLabel>
          <Select
            labelId="aircraft-selector-label"
            value={selectedAircraftId}
            label="Tu Aeronave"
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
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 64, height: 64, borderRadius: 1, overflow: 'hidden' }}>
                <MediaRenderer client={twClient!} src={currentAircraft.metadata.image} />
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle2">{currentAircraft.metadata.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                   Capacidad: {formatNumber(gallonsToLiters(Number(getMissionAttributes(currentAircraft).find(a => a.trait_type === 'combustible')?.value || 0)), 0)} L
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        <Box>
          <Stack direction="row" justifyContent="space-between" mb={1}>
             <Typography variant="body2" display="flex" alignItems="center">
               <GasMeterIcon sx={{ mr: 1, fontSize: 18 }} /> Combustible Requerido
             </Typography>
             <Typography variant="body2" fontWeight="bold">
               {formatNumber(fuelRequired, 0)} L
             </Typography>
          </Stack>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(100, (fuelRequired / fuelBalance) * 100)} 
            color={hasEnoughFuel ? "success" : "error"}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" color={hasEnoughFuel ? "text.secondary" : "error.main"} mt={1} display="block">
            {hasEnoughFuel 
              ? `Balance: ${formatNumber(fuelBalance, 0)} L (Suficiente)` 
              : `Balance insuficiente: ${formatNumber(fuelBalance, 0)} L`}
          </Typography>
        </Box>

        {!hasEnoughFuel && (
           <Alert severity="warning">
             <Typography variant="body2">No tienes suficiente <b>AIRG</b> para este vuelo.</Typography>
             <Button size="small" variant="text" onClick={() => router.push('/gas')}>Recargar Gas</Button>
           </Alert>
        )}

        <Stack direction="row" spacing={2}>
          <Button fullWidth variant="outlined" color="inherit" onClick={onCancel}>
            CAMBIAR
          </Button>
          <Button 
            fullWidth 
            variant="contained" 
            size="large" 
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
