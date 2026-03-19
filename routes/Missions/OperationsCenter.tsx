import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Grid,
  Box,
  Container,
  Stack,
  Typography,
  Paper,
  useTheme,
  GlobalStyles,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Badge,
  alpha
} from '@mui/material'
import MapIcon from '@mui/icons-material/Map'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import SearchIcon from '@mui/icons-material/Search'
import Sidebar from 'routes/Ivao/components/IvaoAtcs'
import Map from 'components/Map/RadarMap'
import MissionBoard from './components/MissionBoard'
import FlightDispatch from './components/FlightDispatch'
import { useVaProviderContext } from 'context/VaProvider'
import { Mission } from 'types'
import nextApiInstance from 'config/axios'
import useOwnedNFTs from 'hooks/useOwnedNFTs'
import { nftAircraftTokenAddress } from 'contracts/address'
import { filterByTokenAddress } from 'utils'
import { useRecoilValue } from 'recoil'
import { ivaoUserAuthStore } from 'store/ivaoUserAuth.atom'

const OperationsCenter = () => {
  const theme = useTheme()
  const { atcs, initIvaoAuth, initIvaoData } = useVaProviderContext()
  const { data: userNfts } = useOwnedNFTs()
  const ivaoAuthToken = useRecoilValue(ivaoUserAuthStore)

  useEffect(() => {
    if (ivaoAuthToken === undefined) {
      initIvaoAuth()
      initIvaoData()
    }
  }, [ivaoAuthToken, initIvaoAuth, initIvaoData])

  const ownedAircrafts = useMemo(
    () => userNfts?.filter(filterByTokenAddress(nftAircraftTokenAddress)) || [],
    [userNfts]
  )

  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [originInput, setOriginInput] = useState<string>('') // To avoid multiple renders on input
  const [origin, setOrigin] = useState<string>('')

  const fetchMissions = useCallback(async () => {
    setIsLoading(true)
    try {
      // We pass the first owned aircraft ID if available, otherwise it works with fallback
      const aircraftId = ownedAircrafts[0]?.nft?.id.toString() || ''
      const url = `/api/missions?aircraftId=${aircraftId}${origin ? `&origin=${origin}` : ''}`
      const response = await nextApiInstance.get<Mission[]>(url)
      setMissions(response.data)
    } catch (error) {
      console.error('Failed to fetch missions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [ownedAircrafts, origin])

  useEffect(() => {
    if (atcs.length > 0) {
      fetchMissions()
    }
  }, [fetchMissions, atcs.length])

  const handleSelectMission = (mission: Mission) => {
    setSelectedMission(mission)
  }

  // Find origin/destination objects for the map based on mission selection
  const mapSelection = useMemo(() => {
    if (!selectedMission) return { origin: null, destination: null }

    // Find destination ATC if it exists, otherwise create a dummy
    let destAtc = atcs.find((a) => a.atcPosition?.airport?.icao === selectedMission.destination) || null
    if (!destAtc && selectedMission.destinationCoords) {
      destAtc = {
        callsign: selectedMission.destination,
        atcPosition: {
          airport: {
            icao: selectedMission.destination,
            latitude: selectedMission.destinationCoords.latitude,
            longitude: selectedMission.destinationCoords.longitude,
            name: selectedMission.destination
          }
        }
      } as any
    }

    // Find origin ATC if it exists, otherwise create a dummy
    let originAtc = atcs.find((a) => a.atcPosition?.airport?.icao === selectedMission.origin) || null
    if (!originAtc && selectedMission.originCoords) {
      originAtc = {
        callsign: selectedMission.origin,
        atcPosition: {
          airport: {
            icao: selectedMission.origin,
            latitude: selectedMission.originCoords.latitude,
            longitude: selectedMission.originCoords.longitude,
            name: selectedMission.origin
          }
        }
      } as any
    }

    return { origin: originAtc, destination: destAtc }
  }, [selectedMission, atcs])

  return (
    <Box component='main' sx={{ height: 'calc(100vh - 64px)', p: 3, overflowY: 'auto', bgcolor: 'background.default' }}>
      <GlobalStyles
        styles={{
          '.radar-popup .leaflet-popup-content-wrapper': {
            background: `${theme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`,
            color: `${theme.palette.text.primary} !important`,
            padding: '0 !important',
            borderRadius: '12px !important',
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0,0,0,0.1)'} !important`,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important'
          },
          '.radar-popup .leaflet-popup-tip': {
            background: `${theme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`,
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0,0,0,0.1)'} !important`
          },
          '.radar-popup .leaflet-popup-content': {
            margin: '0 !important',
            width: 'auto !important',
            padding: '16px !important',
            paddingRight: '32px !important'
          },
          '.radar-popup .leaflet-popup-close-button': {
            color: `${theme.palette.text.secondary} !important`,
            top: '8px !important',
            right: '8px !important',
            fontSize: '20px !important',
            zIndex: 1000
          },
          '.leaflet-tooltip': {
            background: `${theme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`,
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0,0,0,0.1)'} !important`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1) !important',
            color: `${theme.palette.text.primary} !important`,
            padding: '8px !important',
            borderRadius: '8px !important'
          },
          '.leaflet-tooltip-top:before': {
            borderTopColor: `${theme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`
          },
          '.leaflet-tooltip-bottom:before': {
            borderBottomColor: `${theme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`
          },
          '.leaflet-tooltip-left:before': {
            borderLeftColor: `${theme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`
          },
          '.leaflet-tooltip-right:before': {
            borderRightColor: `${theme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`
          }
        }}
      />
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            <Box sx={{ height: 400, borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[4] }}>
              <Map
                towers={atcs}
                origin={mapSelection.origin}
                destination={mapSelection.destination}
                onTowerClick={(tower) => {
                  const icao = tower.atcPosition?.airport?.icao || tower.callsign.split('_')[0]
                  const m = missions.find((m) => m.destination === icao || m.origin === icao)
                  if (m) {
                    setSelectedMission(m)
                  } else {
                    // If no mission, offer to set as origin
                    setOrigin(icao)
                  }
                }}
                theme={theme.palette.mode as 'light' | 'dark'}
              />
            </Box>

            <Box>
              <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
                <Typography variant='h4' fontWeight='bold'>
                  Panel de Misiones Disponibles
                </Typography>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <TextField
                    size='small'
                    placeholder='Origin ICAO...'
                    value={originInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOriginInput(e.target.value.toUpperCase())}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        setOrigin(originInput)
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchIcon color='primary' sx={{ opacity: 0.7 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Box
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                              borderRadius: '4px',
                              px: 1,
                              py: 0.2,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <Typography
                              variant='caption'
                              sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '0.65rem' }}
                            >
                              ENTER
                            </Typography>
                          </Box>
                        </InputAdornment>
                      )
                    }}
                    sx={{ width: 220 }}
                  />
                </Stack>
              </Stack>
              <MissionBoard
                missions={missions}
                isLoading={isLoading}
                onSelect={handleSelectMission}
                selectedMission={selectedMission || undefined}
              />
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          {selectedMission ? (
            <FlightDispatch mission={selectedMission} onCancel={() => setSelectedMission(null)} />
          ) : (
            <Paper
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3,
                border: '2px dashed',
                borderColor: 'divider',
                bgcolor: 'transparent'
              }}
            >
              <Typography variant='h5' color='text.secondary' align='center'>
                SELECCIONA UNA MISIÓN PARA EMPEZAR EL DESPACHO
              </Typography>
              <Typography variant='body2' color='text.secondary' align='center' mt={1}>
                Elige un destino patrocinado para obtener más recompensas.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default OperationsCenter
