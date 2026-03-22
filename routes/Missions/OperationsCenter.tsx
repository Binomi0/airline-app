import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Grid, Box, Stack, Typography, useTheme, TextField, InputAdornment, Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Map from 'components/Map/RadarMap'
import MissionBoard from './components/MissionBoard'
import SuggestedMissions from './components/SuggestedMissions'
import FlightDispatch from './components/FlightDispatch'
import { useVaProviderContext } from 'context/VaProvider'
import { Atc, PublicMission } from 'types'
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

  const [missions, setMissions] = useState<PublicMission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMission, setSelectedMission] = useState<PublicMission | null>(null)
  const [originInput, setOriginInput] = useState<string>('')
  const [origin, setOrigin] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const validateIcao = (code: string) => {
    if (code === '') return true
    const isValid = /^[A-Z0-9]{3,4}$/.test(code)
    if (!isValid) {
      setError('ICAO INVÁLIDO (3-4 CARACTERES)')
      return false
    }
    setError(null)
    return true
  }

  const fetchMissions = useCallback(async () => {
    setIsLoading(true)
    console.log('Fetching missions with origin:', origin)
    try {
      // We pass the first owned aircraft ID if available, otherwise it works with fallback
      const aircraftId = ownedAircrafts[0]?.nft?.id.toString() || ''
      const url = `/api/missions?aircraftId=${aircraftId}${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`
      console.log('API URL:', url)
      const response = await nextApiInstance.get<PublicMission[]>(url)
      setMissions(response.data)
    } catch (error) {
      console.error('Failed to fetch missions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [ownedAircrafts, origin])

  useEffect(() => {
    fetchMissions()
  }, [fetchMissions, origin])

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

  const suggestedMissions = useMemo(() => {
    // We prioritize Top Flights (multiplier >= 1.9)
    const topFlights = missions.filter((m) => m.rewardMultiplier >= 1.9)
    if (topFlights.length >= 5) return topFlights.slice(0, 10)

    // Then we add those with best prize
    const otherMissions = missions
      .filter((m) => m.rewardMultiplier < 1.9)
      .sort((a, b) => b.prize - a.prize)

    return [...topFlights, ...otherMissions].slice(0, 10)
  }, [missions])

  return (
    <Box component='main' sx={{ height: 'calc(100vh - 64px)', p: 3, overflowY: 'auto', bgcolor: 'background.default' }}>
      <SuggestedMissions
        missions={suggestedMissions}
        onSelect={(m) => setSelectedMission(m)}
        selectedMission={selectedMission || undefined}
        isLoading={isLoading}
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
                    setOriginInput(icao)
                    setError(null)
                  }
                }}
                theme={theme.palette.mode as 'light' | 'dark'}
              />
            </Box>

            <MissionBoard
              missions={missions}
              onSelect={(m) => setSelectedMission(m)}
              selectedMission={selectedMission || undefined}
              isLoading={isLoading}
              filterSlot={
                <TextField
                  size='small'
                  placeholder='ORIGIN ICAO...'
                  variant='outlined'
                  color='primary'
                  error={!!error}
                  helperText={error}
                  value={originInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                    if (value.length <= 4) {
                      setOriginInput(value)
                      if (error) setError(null) // Clear error while typing
                    }
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      if (validateIcao(originInput)) {
                        setOrigin(originInput)
                      }
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
                        <Typography variant='caption' color='primary' sx={{ opacity: 0.5 }}>
                          ENTER
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiFormHelperText-root': {
                      position: 'absolute',
                      bottom: -20,
                      fontWeight: 'bold',
                      fontSize: '0.65rem'
                    }
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
                variant='outlined'
                sx={{
                  p: 3,
                  minHeight: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  bgcolor: 'transparent'
                }}
              >
                <Typography variant='h6' color='text.secondary' align='center'>
                  SELECCIONA UNA MISIÓN PARA EMPEZAR EL DESPACHO
                </Typography>
                <Typography variant='caption' color='text.secondary' align='center' mt={1}>
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
