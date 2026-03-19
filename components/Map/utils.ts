import { Atc } from 'types'

export const getCoords = (tower: Atc): [number, number] | null => {
  let lat = tower?.atcPosition?.airport?.latitude || tower?.atcPosition?.latitude
  let lon = tower?.atcPosition?.airport?.longitude || tower?.atcPosition?.longitude
  if (lat === undefined || lon === undefined) {
    lat = tower?.lastTrack?.latitude
    lon = tower?.lastTrack?.longitude
  }
  if (lat === undefined || lon === undefined) {
    lat = tower?.latitude
    lon = tower?.longitude
  }
  if (lat === undefined || lon === undefined || lat === null || lon === null) return null
  return [Number(lat), Number(lon)]
}

export const calculateDistance = (c1: [number, number], c2: [number, number]): number => {
  const toRad = (x: number) => (x * Math.PI) / 180
  const R = 3440.065
  const dLat = toRad(c2[0] - c1[0])
  const dLon = toRad(c2[1] - c1[1])
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(c1[0])) * Math.cos(toRad(c2[0])) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

export const getCurvePath = (c1: [number, number], c2: [number, number], segments: number = 30): [number, number][] => {
  const points: [number, number][] = []
  
  // Halfway point
  const midLat = (c1[0] + c2[0]) / 2
  const midLon = (c1[1] + c2[1]) / 2
  
  // Vector from c1 to c2
  const dLat = c2[0] - c1[0]
  const dLon = c2[1] - c1[1]
  
  // Control point offset (perpendicular to the line)
  const curveIntensity = 0.15
  const ctrlLat = midLat - dLon * curveIntensity
  const ctrlLon = midLon + dLat * curveIntensity
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const bLat = (1 - t) * (1 - t) * c1[0] + 2 * (1 - t) * t * ctrlLat + t * t * c2[0]
    const bLon = (1 - t) * (1 - t) * c1[1] + 2 * (1 - t) * t * ctrlLon + t * t * c2[1]
    points.push([bLat, bLon])
  }
  
  return points
}
