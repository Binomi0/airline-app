import { NextApiRequest, NextApiResponse } from 'next'
import { PublicMission, MissionType, MissionCategory, PublicMissionStatus } from 'types'
import moment from 'moment'

const LEMD_COORDS = { latitude: 40.471926, longitude: -3.56264 }
const LEBL_COORDS = { latitude: 41.297078, longitude: 2.078464 }
const LEMG_COORDS = { latitude: 36.6749, longitude: -4.4991 }
const LEVC_COORDS = { latitude: 39.4893, longitude: -0.4816 }

const getCoords = (icao: string) => {
  if (icao === 'LEMD') return LEMD_COORDS
  if (icao === 'LEBL') return LEBL_COORDS
  if (icao === 'LEMG') return LEMG_COORDS
  if (icao === 'LEVC') return LEVC_COORDS
  return LEMD_COORDS
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid event ID' })
  }

  // IDs look like: {airline}-{origin}-{destination}-{timestamp}
  const parts = id.split('-')
  if (parts.length < 4) {
    return res.status(404).json({ error: 'Event not found' })
  }

  const airlineId = parts[0]
  const origin = parts[1].toUpperCase()
  const destination = parts[2].toUpperCase()
  const timestamp = parseInt(parts[3])

  const eventTime = moment.unix(timestamp)

  const airlineData: Record<string, { prefix: string; multiplier: number; prize: number }> = {
    iberia: { prefix: 'IBE', multiplier: 2.0, prize: 1500 },
    vueling: { prefix: 'VLG', multiplier: 1.8, prize: 1200 },
    ryanair: { prefix: 'RYR', multiplier: 1.5, prize: 900 }
  }

  const data = airlineData[airlineId] || airlineData.iberia

  const event: Partial<PublicMission> = {
    _id: id,
    origin,
    destination,
    distance: 260,
    type: MissionType.PASSENGER,
    category: MissionCategory.EVENT,
    isSponsored: true,
    rewardMultiplier: data.multiplier,
    prize: data.prize,
    basePrize: data.prize / data.multiplier,
    startTime: eventTime.toDate(),
    endTime: moment(eventTime).add(75, 'minutes').toDate(),
    expiresAt: moment(eventTime).add(15, 'minutes').toDate(),
    originCoords: getCoords(origin),
    destinationCoords: getCoords(destination),
    details: {
      name: `Vuelo ${airlineId.toUpperCase()} ${origin}-${destination}`,
      description: `Vuelo regular patrocinado por ${airlineId.charAt(0).toUpperCase() + airlineId.slice(1)} entre ${origin} y ${destination}.`
    },
    callsign: `${data.prefix}${eventTime.format('HH')}${origin === 'LEMD' || (airlineId !== 'iberia' && origin === 'LEBL') ? '1' : '2'}`,
    weight: 15000,
    status: PublicMissionStatus.AVAILABLE,
    airlineId
  }

  res.status(200).json(event)
}

export default handler
