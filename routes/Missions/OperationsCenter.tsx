import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Grid,
  Box,
  Stack,
  Typography,
  useTheme,
  GlobalStyles,
  TextField,
  InputAdornment,
  alpha,
  Paper
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Map from 'components/Map/RadarMap'
import MissionBoard from './components/MissionBoard'
import FlightDispatch from './components/FlightDispatch'
import { useVaProviderContext } from 'context/VaProvider'
import { Atc, Mission } from 'types'
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
      } as Atc
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
      } as Atc
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

            <MissionBoard
              missions={missions}
              onSelect={setSelectedMission}
              selectedMission={selectedMission || undefined}
              isLoading={isLoading}
              filterSlot={
                <TextField
                  size='small'
                  placeholder='ORIGIN ICAO...'
                  variant='outlined'
                  value={originInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOriginInput(e.target.value.toUpperCase())}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      setOrigin(originInput)
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 32,
                      fontFamily: "'VT323', monospace",
                      fontSize: '1rem',
                      color: 'primary.main',
                      bgcolor: 'rgba(59, 130, 246, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(59, 130, 246, 0.2)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(59, 130, 246, 0.4)'
                      }
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(59, 130, 246, 0.5)',
                      opacity: 1
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon sx={{ color: 'primary.main', fontSize: 18, opacity: 0.7 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Typography
                          variant='caption'
                          sx={{ fontFamily: "'VT323', monospace", color: 'primary.main', opacity: 0.5 }}
                        >
                          ENTER
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                />
              }
            />
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ position: 'sticky', top: 0 }}>
            {selectedMission ? (
              <FlightDispatch mission={selectedMission} onCancel={() => setSelectedMission(null)} />
            ) : (
              <Paper
                sx={{
                  p: 4,
                  minHeight: 400,
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OperationsCenter
