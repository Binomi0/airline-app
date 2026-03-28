import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Grid, Box, Stack, Typography, TextField, InputAdornment, Paper } from '@mui/material'
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
import { useQuery } from '@tanstack/react-query'

import PageContainer from 'components/ui/PageContainer'

const OperationsCenter = () => {
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

  const { data: missions = [], isLoading } = useQuery({
    queryKey: ['missions', ownedAircrafts[0]?.nft?.id, origin],
    queryFn: async () => {
      // We pass the first owned aircraft ID if available, otherwise it works with fallback
      const aircraftId = ownedAircrafts[0]?.nft?.id.toString() || ''
      const url = `/api/missions?aircraftId=${aircraftId}${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`
      const response = await nextApiInstance.get<PublicMission[]>(url)
      return response.data
    }
  })

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
    const otherMissions = missions.filter((m) => m.rewardMultiplier < 1.9).sort((a, b) => b.prize - a.prize)

    return [...topFlights, ...otherMissions].slice(0, 10)
  }, [missions])

  return (
    <PageContainer>
      <SuggestedMissions
        missions={suggestedMissions}
        onSelect={(m) => setSelectedMission(m)}
        selectedMission={selectedMission || undefined}
        isLoading={isLoading}
      />

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            <Box style={{ height: 400, borderRadius: 24, overflow: 'hidden' }}>
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
                        <SearchIcon color='primary' style={{ fontSize: 18, opacity: 0.7 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Typography variant='caption' color='primary' style={{ opacity: 0.5 }}>
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
          <Box style={{ position: 'sticky', top: 0 }}>
            {selectedMission ? (
              <FlightDispatch mission={selectedMission} onCancel={() => setSelectedMission(null)} />
            ) : (
              <EmptyDispatch mission={selectedMission} />
            )}
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

const EmptyDispatch = ({ mission }: { mission: PublicMission | null }) => (
  <Paper
    variant='outlined'
    style={{
      padding: '24px',
      minHeight: 300,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderStyle: 'dashed',
      borderWidth: 2,
      backgroundColor: 'transparent'
    }}
  >
    <Typography variant='h6' color='text.secondary' align='center'>
      SELECCIONA UNA MISIÓN PARA EMPEZAR EL DESPACHO
    </Typography>
    <Typography variant='caption' color='text.secondary' align='center' mt={1}>
      Elige un destino patrocinado para obtener más recompensas.
    </Typography>
  </Paper>
)

export default OperationsCenter
