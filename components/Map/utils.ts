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
