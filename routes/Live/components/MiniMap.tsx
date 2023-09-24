import { Box } from '@mui/material'
import { GoogleMap, Marker, useJsApiLoader, Polyline } from '@react-google-maps/api'
import { useVaProviderContext } from 'context/VaProvider'
import React from 'react'
import { Atc, IvaoPilot } from 'types'

const getOriginCoords = (pilot: IvaoPilot, atcs: Readonly<Atc[]>) => {
  const atc = atcs.find((atc) => atc.callsign.includes(pilot.flightPlan.departureId))
  if (!atc) {
    console.error('Origin ATC not found', pilot.flightPlan.departureId)
    return { lat: pilot.lastTrack.latitude, lng: pilot.lastTrack.longitude }
  }
  const lat = atc.lastTrack.latitude
  const lng = atc.lastTrack.longitude

  return { lat, lng }
}

const getDestinationCoords = (pilot: IvaoPilot, atcs: Readonly<Atc[]>) => {
  const atc = atcs.find((atc) => atc.callsign.includes(pilot.flightPlan.arrivalId))
  if (!atc) {
    console.error('Destination ATC not found', atc)
    return { lat: pilot.lastTrack.latitude, lng: pilot.lastTrack.longitude }
  }
  const lat = atc.lastTrack.latitude
  const lng = atc.lastTrack.longitude

  return { lat, lng }
}

const containerStyle = {
  width: '500px',
  height: '400px',
  opacity: 0.5
}

interface Props {
  pilot: IvaoPilot
}

const MiniMap = ({ pilot }: Props) => {
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
      bounds.extend(getOriginCoords(pilot, atcs))
      bounds.extend(getDestinationCoords(pilot, atcs))
      newMap.fitBounds(bounds)

      setMap(newMap)
    },
    [atcs, pilot]
  )

  const onUnmount = React.useCallback(function callback() {
    setMap(undefined)
  }, [])
  return (
    <Box zIndex={2} position='absolute' top={150} right={400}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: pilot.lastTrack.latitude, lng: pilot.lastTrack.longitude }}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          <Marker key={1} title='ORIGIN' position={getOriginCoords(pilot, atcs)}></Marker>
          <Marker key={2} position={{ lat: pilot.lastTrack.latitude, lng: pilot.lastTrack.longitude }}></Marker>
          <Marker key={3} title='DESTINATION' position={getDestinationCoords(pilot, atcs)}></Marker>
          <Polyline
            path={[getOriginCoords(pilot, atcs), { lat: pilot.lastTrack.latitude, lng: pilot.lastTrack.longitude }]}
            options={{
              strokeColor: 'blue', // Customize the line color
              strokeOpacity: 1.0,
              strokeWeight: 3 // Adjust the line thickness
            }}
          />
          <Polyline
            path={[
              { lat: pilot.lastTrack.latitude, lng: pilot.lastTrack.longitude },
              getDestinationCoords(pilot, atcs)
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
  )
}

export default MiniMap

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
