import React from 'react'
import { Box } from '@mui/material'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import { Atc } from 'types'
import RadarMarker from './RadarMarker'
import { getCoords, getCurvePath } from './utils'

export interface RadarMapProps {
  towers: readonly Atc[]
  origin: Atc | null
  destination: Atc | null
  onTowerClick: (tower: Atc) => void
  theme: 'light' | 'dark'
}

interface MapBoundsControllerProps {
  origin: Atc | null
  destination: Atc | null
}

const MapBoundsController: React.FC<MapBoundsControllerProps> = ({ origin, destination }) => {
  const map = useMap()

  React.useEffect(() => {
    if (origin && destination) {
      const c1 = getCoords(origin)
      const c2 = getCoords(destination)
      if (c1 && c2) {
        map.fitBounds([c1, c2], { padding: [50, 50], animate: true })
      }
    }
  }, [origin, destination, map])

  return null
}

const RadarMap: React.FC<RadarMapProps> = ({ towers, origin, destination, onTowerClick, theme }) => {
  const polylinePath = React.useMemo(() => {
    if (!origin || !destination) return null
    const c1 = getCoords(origin)
    const c2 = getCoords(destination)
    if (!c1 || !c2) return null
    return getCurvePath(c1, c2)
  }, [origin, destination])

  return (
    <Box sx={{ height: '100%', width: '100%', zIndex: 1 }}>
      <MapContainer
        center={[20, 0]}
        zoom={2.5}
        style={{ height: '100%', width: '100%', background: theme === 'dark' ? '#020617' : '#f1f5f9' }}
        zoomControl={false}
        maxBounds={[
          [-85, -180],
          [85, 180]
        ]}
        maxBoundsViscosity={1.0}
      >
        <MapBoundsController origin={origin} destination={destination} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={
            theme === 'dark'
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          }
        />

        {/* RADAR OVERLAY FILTER */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 400,
            background: 'radial-gradient(circle, transparent 20%, rgba(2, 6, 23, 0.2) 100%)',
            boxShadow: 'inset 0 0 100px rgba(56, 189, 248, 0.1)'
          }}
        />

        {towers.map((tower, idx) => {
          const pos = getCoords(tower)
          if (!pos) return null

          return (
            <RadarMarker
              key={`${tower.callsign || idx}`}
              tower={tower}
              position={pos}
              isOrigin={origin?.callsign === tower.callsign}
              isDestination={destination?.callsign === tower.callsign}
              onTowerClick={onTowerClick}
              theme={theme}
            />
          )
        })}

        {polylinePath && (
          <Polyline
            positions={polylinePath}
            className='flight-path'
            pathOptions={{
              color: '#38bdf8',
              weight: 3,
              opacity: 0.8,
              dashArray: '10, 10',
              lineJoin: 'round'
            }}
          />
        )}
      </MapContainer>
    </Box>
  )
}

export default RadarMap
