import { NextApiRequest, NextApiResponse } from 'next'
import { PublicMission, MissionType, MissionCategory, PublicMissionStatus } from 'types'
import moment from 'moment'

const LEMD_COORDS = { latitude: 40.471926, longitude: -3.56264 }
const LEBL_COORDS = { latitude: 41.297078, longitude: 2.078464 }

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const flights: Partial<PublicMission>[] = []
  const now = moment().startOf('minute')

  // Generate the next 12 slots
  for (let i = 0; i < 12; i++) {
    // Madrid to Barcelona (at :00)
    const madTime = moment(now).add(i, 'hours').startOf('hour')
    if (madTime.isAfter(now)) {
      flights.push({
        _id: `puente-mad-bcn-${madTime.unix()}`,
        origin: 'LEMD',
        destination: 'LEBL',
        distance: 260,
        type: MissionType.PASSENGER,
        category: MissionCategory.EVENT,
        isSponsored: true,
        rewardMultiplier: 2.0,
        prize: 1500, // Attractive prize for sponsored event
        basePrize: 750,
        startTime: madTime.toDate(),
        endTime: moment(madTime).add(75, 'minutes').toDate(),
        expiresAt: moment(madTime).add(15, 'minutes').toDate(),
        originCoords: LEMD_COORDS,
        destinationCoords: LEBL_COORDS,
        details: {
          name: 'Puente Aéreo MAD-BCN',
          description: 'Vuelo regular patrocinado por Iberia entre Madrid y Barcelona. Consigue el doble de recompensas.'
        },
        callsign: `IBE${madTime.format('HH')}1`,
        weight: 15000,
        status: PublicMissionStatus.AVAILABLE
      })
    }

    // Barcelona to Madrid (at :30)
    const bcnTime = moment(now).add(i, 'hours').startOf('hour').add(30, 'minutes')
    if (bcnTime.isAfter(now)) {
      flights.push({
        _id: `puente-bcn-mad-${bcnTime.unix()}`,
        origin: 'LEBL',
        destination: 'LEMD',
        distance: 260,
        type: MissionType.PASSENGER,
        category: MissionCategory.EVENT,
        isSponsored: true,
        rewardMultiplier: 2.0,
        prize: 1500,
        basePrize: 750,
        startTime: bcnTime.toDate(),
        endTime: moment(bcnTime).add(75, 'minutes').toDate(),
        expiresAt: moment(bcnTime).add(15, 'minutes').toDate(),
        originCoords: LEBL_COORDS,
        destinationCoords: LEMD_COORDS,
        details: {
          name: 'Puente Aéreo BCN-MAD',
          description: 'Vuelo regular patrocinado por Iberia entre Barcelona y Madrid. Consigue el doble de recompensas.'
        },
        callsign: `IBE${bcnTime.format('HH')}2`,
        weight: 15000,
        status: PublicMissionStatus.AVAILABLE
      })
    }
  }

  // Sort by start time
  const sortedFlights = flights.sort((a, b) => a.startTime!.getTime() - b.startTime!.getTime())

  res.status(200).json(sortedFlights)
}

export default handler
