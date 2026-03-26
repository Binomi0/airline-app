import { NextApiRequest, NextApiResponse } from 'next'
import { PublicMission, MissionType, MissionCategory, PublicMissionStatus } from 'types'
import moment from 'moment'

const LEMD_COORDS = { latitude: 40.471926, longitude: -3.56264 }
const LEBL_COORDS = { latitude: 41.297078, longitude: 2.078464 }

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid event ID' })
  }

  // IDs look like: puente-mad-bcn-1711411200
  const parts = id.split('-')
  if (parts.length < 4) {
    return res.status(404).json({ error: 'Event not found' })
  }

  const timestamp = parseInt(parts[3])
  const origin = parts[1].toUpperCase()
  const destination = parts[2].toUpperCase()

  const eventTime = moment.unix(timestamp)
  const isMadToBcn = origin === 'MAD'

  const event: Partial<PublicMission> = {
    _id: id,
    origin: isMadToBcn ? 'LEMD' : 'LEBL',
    destination: isMadToBcn ? 'LEBL' : 'LEMD',
    distance: 260,
    type: MissionType.PASSENGER,
    category: MissionCategory.EVENT,
    isSponsored: true,
    rewardMultiplier: 2.0,
    prize: 1500,
    basePrize: 750,
    startTime: eventTime.toDate(),
    endTime: moment(eventTime).add(75, 'minutes').toDate(),
    expiresAt: moment(eventTime).add(15, 'minutes').toDate(),
    originCoords: isMadToBcn ? LEMD_COORDS : LEBL_COORDS,
    destinationCoords: isMadToBcn ? LEBL_COORDS : LEMD_COORDS,
    details: {
      name: `Puente Aéreo ${origin}-${destination}`,
      description: `Vuelo regular patrocinado por Iberia entre ${isMadToBcn ? 'Madrid' : 'Barcelona'} y ${isMadToBcn ? 'Barcelona' : 'Madrid'}. Consigue el doble de recompensas.`
    },
    callsign: `IBE${eventTime.format('HH')}${isMadToBcn ? '1' : '2'}`,
    weight: 15000,
    status: PublicMissionStatus.AVAILABLE
  }

  res.status(200).json(event)
}

export default handler
