import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material'
import React from 'react'
import { Atc, IvaoPilot } from 'types'
import image from '../../../public/img/cockpit_view.jpg'
import Image from 'next/image'
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api'
import { useVaProviderContext } from 'context/VaProvider'

const getOriginCoords = (flightPlan: IvaoPilot['flightPlan'], atcs: Atc[]) => {
  const atc = atcs.find((atc) => atc.callsign.startsWith(flightPlan.departureId))
  if (!atc) {
    return { lat: 0, lng: 0 }
  }
  const lat = atc.lastTrack.latitude
  const lng = atc.lastTrack.longitude

  return { lat, lng }
}

const getDestinationCoords = (flightPlan: IvaoPilot['flightPlan'], atcs: Atc[]) => {
  const atc = atcs.find((atc) => atc.callsign.startsWith(flightPlan.arrivalId))
  if (!atc) {
    return { lat: 0, lng: 0 }
  }
  const lat = atc.lastTrack.latitude
  const lng = atc.lastTrack.longitude

  return { lat, lng }
}

const containerStyle = {
  width: '400px',
  height: '400px',
  opacity: 0.5
}

interface Props {
  pilot: IvaoPilot
  onDisconnect: () => void
}
const MCDUView = ({ pilot, onDisconnect }: Props) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY
  })
  const [map, setMap] = React.useState<google.maps.Map | undefined>(undefined)
  const { atcs } = useVaProviderContext()

  const onLoad = React.useCallback(
    function callback(newMap: google.maps.Map) {
      const bounds = new window.google.maps.LatLngBounds({
        lat: pilot.lastTrack.latitude,
        lng: pilot.lastTrack.longitude
      })
      bounds.extend(getOriginCoords(pilot.flightPlan, atcs))
      bounds.extend(getDestinationCoords(pilot.flightPlan, atcs))
      newMap.fitBounds(bounds)

      setMap(newMap)
    },
    [atcs, pilot.flightPlan, pilot.lastTrack.latitude, pilot.lastTrack.longitude]
  )

  const onUnmount = React.useCallback(function callback() {
    setMap(undefined)
  }, [])

  if (!pilot) return <LinearProgress />

  return (
    <Box>
      <Box zIndex={2} position='absolute' top={150} left={400}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: pilot.lastTrack.latitude, lng: pilot.lastTrack.longitude }}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
          >
            <Marker key={1} title='ORIGIN' position={getOriginCoords(pilot.flightPlan, atcs)}></Marker>
            <Marker key={2} position={{ lat: pilot.lastTrack.latitude, lng: pilot.lastTrack.longitude }}></Marker>
            <Marker key={3} title='DESTINATION' position={getDestinationCoords(pilot.flightPlan, atcs)}></Marker>
            <Polyline
              path={[
                getOriginCoords(pilot.flightPlan, atcs),
                { lat: pilot.lastTrack.latitude, lng: pilot.lastTrack.longitude }
              ]}
              options={{
                strokeColor: 'blue', // Customize the line color
                strokeOpacity: 1.0,
                strokeWeight: 3 // Adjust the line thickness
              }}
            />
            <Polyline
              path={[
                { lat: pilot.lastTrack.latitude, lng: pilot.lastTrack.longitude },
                getDestinationCoords(pilot.flightPlan, atcs)
              ]}
              options={{
                strokeColor: 'green', // Customize the line color
                strokeOpacity: 1.0,
                strokeWeight: 3 // Adjust the line thickness
              }}
            />
          </GoogleMap>
        ) : (
          <></>
        )}
      </Box>
      <Image src={image} fill objectFit='none' alt='flight' style={{ opacity: 0.4, filter: 'blur(0.2rem)' }} />
      <Stack direction='row' justifyContent='center' sx={{ fontFamily: 'B612 Mono', zIndex: -1 }}>
        <Stack justifyContent='space-between' sx={{ zIndex: 1 }}>
          <Box width={640} height={480} bgcolor='secondary.dark' p={2} sx={{ boxShadow: '0 0 100px inset #000' }}>
            <Stack direction='row' justifyContent='space-between'>
              <Typography paragraph sx={{ fontFamily: 'B612 Mono' }}>
                Connected, tracking... {pilot.callsign}
              </Typography>
              <Typography fontSize={28} paragraph sx={{ fontFamily: 'B612 Mono', fontWeight: 500 }}>
                {pilot.flightPlan.departureId}/{pilot.flightPlan.arrivalId}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>
              {pilot.lastTrack.onGround ? 'En tierra' : 'En el aire'}
            </Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>Estado ({pilot.lastTrack.state})</Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>Speed ({pilot.lastTrack.groundSpeed}) kt/h</Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>Rating ({pilot.rating})</Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>People On Board {pilot.flightPlan.peopleOnBoard}</Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>
              To arrival distance {Math.floor(pilot.lastTrack.arrivalDistance || 0)} miles
            </Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>
              From departure distance {Math.floor(pilot.lastTrack.departureDistance || 0)} miles
            </Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>
              SQUACK{' '}
              {Number(pilot.lastTrack.transponder) < 1000
                ? `0${pilot.lastTrack.transponder}`
                : pilot.lastTrack.transponder}
            </Typography>
          </Box>
          <Button variant='text' color='secondary' onClick={onDisconnect}>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>Disconnect</Typography>
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default MCDUView

const mapOptions = {
  disableDefaultUI: true,
  styles: [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#242f3e'
        }
      ]
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#242f3e'
        }
      ]
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#746855'
        }
      ]
    }
    // Add more style rules for night mode here
  ]
}
