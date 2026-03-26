import { NextApiRequest, NextApiResponse } from 'next'
import { PublicMission, MissionType, MissionCategory, PublicMissionStatus, Coords } from 'types'
import moment from 'moment'

const LEMD_COORDS = { latitude: 40.471926, longitude: -3.56264 }
const LEBL_COORDS = { latitude: 41.297078, longitude: 2.078464 }
const LEMG_COORDS = { latitude: 36.6749, longitude: -4.4991 }
const LEVC_COORDS = { latitude: 39.4893, longitude: -0.4816 }

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { airline } = req.query
  const flights: Partial<PublicMission>[] = []
  const now = moment().startOf('minute')

  const generateFlights = (
    airlineId: string,
    prefix: string,
    airportA: string,
    airportACoords: Coords,
    airportB: string,
    airportBCoords: Coords,
    multiplier: number,
    prize: number,
    slots: number = 6
  ) => {
    const list: Partial<PublicMission>[] = []
    for (let i = 0; i < slots; i++) {
      // A to B (at :00 or similar)
      const timeA = moment(now)
        .add(i * 1, 'hours')
        .startOf('hour')
      if (timeA.isAfter(now)) {
        list.push({
          _id: `${airlineId}-${airportA.toLowerCase()}-${airportB.toLowerCase()}-${timeA.unix()}`,
          origin: airportA,
          destination: airportB,
          distance: 260,
          type: MissionType.PASSENGER,
          category: MissionCategory.EVENT,
          isSponsored: true,
          rewardMultiplier: multiplier,
          prize: prize,
          basePrize: prize / multiplier,
          startTime: timeA.toDate(),
          endTime: moment(timeA).add(75, 'minutes').toDate(),
          expiresAt: moment(timeA).add(15, 'minutes').toDate(),
          originCoords: airportACoords,
          destinationCoords: airportBCoords,
          details: {
            name: `Vuelo ${airlineId.toUpperCase()} ${airportA}-${airportB}`,
            description: `Vuelo regular patrocinado por ${airlineId.charAt(0).toUpperCase() + airlineId.slice(1)} entre ${airportA} y ${airportB}.`
          },
          callsign: `${prefix}${timeA.format('HH')}1`,
          weight: 15000,
          status: PublicMissionStatus.AVAILABLE,
          airlineId
        })
      }

      // B to A (at :30 or similar)
      const timeB = moment(now)
        .add(i * 1, 'hours')
        .startOf('hour')
        .add(30, 'minutes')
      if (timeB.isAfter(now)) {
        list.push({
          _id: `${airlineId}-${airportB.toLowerCase()}-${airportA.toLowerCase()}-${timeB.unix()}`,
          origin: airportB,
          destination: airportA,
          distance: 260,
          type: MissionType.PASSENGER,
          category: MissionCategory.EVENT,
          isSponsored: true,
          rewardMultiplier: multiplier,
          prize: prize,
          basePrize: prize / multiplier,
          startTime: timeB.toDate(),
          endTime: moment(timeB).add(75, 'minutes').toDate(),
          expiresAt: moment(timeB).add(15, 'minutes').toDate(),
          originCoords: airportBCoords,
          destinationCoords: airportACoords,
          details: {
            name: `Vuelo ${airlineId.toUpperCase()} ${airportB}-${airportA}`,
            description: `Vuelo regular patrocinado por ${airlineId.charAt(0).toUpperCase() + airlineId.slice(1)} entre ${airportB} y ${airportA}.`
          },
          callsign: `${prefix}${timeB.format('HH')}2`,
          weight: 15000,
          status: PublicMissionStatus.AVAILABLE,
          airlineId
        })
      }
    }
    return list
  }

  if (!airline || airline === 'iberia') {
    flights.push(...generateFlights('iberia', 'IBE', 'LEMD', LEMD_COORDS, 'LEBL', LEBL_COORDS, 2.0, 1500))
  }
  if (!airline || airline === 'vueling') {
    flights.push(...generateFlights('vueling', 'VLG', 'LEBL', LEBL_COORDS, 'LEMG', LEMG_COORDS, 1.8, 1200))
  }
  if (!airline || airline === 'ryanair') {
    flights.push(...generateFlights('ryanair', 'RYR', 'LEBL', LEBL_COORDS, 'LEVC', LEVC_COORDS, 1.5, 900))
  }

  // Sort by start time
  const sortedFlights = flights.sort((a, b) => a.startTime!.getTime() - b.startTime!.getTime())

  res.status(200).json(sortedFlights)
}

export default handler
