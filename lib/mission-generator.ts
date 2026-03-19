import AtcModel from 'models/Atc'
import VirtualAirlineModel from 'models/VirtualAirline'
import PilotModel from 'models/Pilot'
import { MissionStatus, MissionType, ActiveAtc, Coords } from 'types'
import { getDistanceByCoords, randomIntFromInterval, getRandomInt } from 'utils'
import { ObjectId } from 'mongodb'

interface MissionBlueprint {
  type: MissionType
  name: string
  description: string
  multiplier: number
}

const MISSION_BLUEPRINTS: MissionBlueprint[] = [
  {
    type: MissionType.CARGO,
    name: 'Cargo Express',
    description: 'Urgent delivery of high-value goods.',
    multiplier: 1.2
  },
  {
    type: MissionType.PASSENGER,
    name: 'Regional Shuttle',
    description: 'Transporting passengers to their destination.',
    multiplier: 1.0
  },
  {
    type: MissionType.HUMANITARIAN,
    name: 'Medical Supplies',
    description: 'Urgent medical supply delivery to local hospitals.',
    multiplier: 1.5
  },
  {
    type: MissionType.VIP,
    name: 'VIP Charter',
    description: 'Luxury transport for high-profile clients.',
    multiplier: 2.0
  }
]

export const getPlayerLocation = async (
  userId: string
): Promise<{ icao: string; latitude: number; longitude: number } | null> => {
  let icao = 'LEMD' // Default

  // 1. Try Live IVAO Pilot data
  const pilot = await PilotModel.findOne({ userId })
  if (pilot?.lastTrack) {
    if (pilot.lastTrack.onGround) {
      if (pilot.flightPlan?.arrivalId) icao = pilot.flightPlan.arrivalId
      else if (pilot.flightPlan?.departureId) icao = pilot.flightPlan.departureId
    }
    // If they have track, we use those coordinates!
    if (pilot.lastTrack.latitude && pilot.lastTrack.longitude) {
      return { icao, latitude: pilot.lastTrack.latitude, longitude: pilot.lastTrack.longitude }
    }
  }

  // 2. Try VirtualAirline lastLandedAt
  const va = await VirtualAirlineModel.findOne({ userId })
  if (va?.lastLandedAt) icao = va.lastLandedAt

  // Search for the icao coordinates in Atc collection as a database fallback
  const airportInAtc = await AtcModel.findOne({ 'atcPosition.airport.icao': icao }).lean()
  if (airportInAtc?.atcPosition?.airport) {
    return {
      icao,
      latitude: airportInAtc.atcPosition.airport.latitude,
      longitude: airportInAtc.atcPosition.airport.longitude
    }
  }

  // Final fallback (Madrid - LEMD)
  return { icao: 'LEMD', latitude: 40.4839, longitude: -3.5679 }
}

export const generateMissionsForUser = async (userId: string, aircraftId: string) => {
  const location = await getPlayerLocation(userId)
  if (!location) return []

  // Get active towers (destinations) nearby
  // In a real app we'd filter by distance, but for now let's get any active ATC
  const activeAtcs = await AtcModel.find({
    'atcPosition.airport.icao': { $ne: location.icao },
    'atcPosition.airport.latitude': { $exists: true }
  })
    .limit(10)
    .lean()

  const missions = activeAtcs
    .map((atc: ActiveAtc) => {
      const blueprint = MISSION_BLUEPRINTS[getRandomInt(MISSION_BLUEPRINTS.length)]

      // Safety check for coordinates
      const destAirport = atc.atcPosition?.airport
      if (!destAirport?.latitude || !destAirport?.longitude) return null

      const distance = getDistanceByCoords(
        { latitude: location.latitude, longitude: location.longitude } as Coords,
        { latitude: destAirport.latitude, longitude: destAirport.longitude } as Coords
      )

      // Calculate prize: base + (distance * multiplier)
      const basePrize = (500 + distance * 2) * blueprint.multiplier

      return {
        userId: new ObjectId(userId),
        origin: location.icao,
        destination: destAirport.icao || 'UNKNOWN',
        distance: Math.round(distance),
        type: blueprint.type,
        details: {
          name: blueprint.name,
          description: `${blueprint.description} Distance: ${Math.round(distance)} NM.`
        },
        aircraftId,
        callsign: `WF${randomIntFromInterval(1000, 9999)}`,
        weight: randomIntFromInterval(500, 5000),
        prize: Math.round(basePrize),
        status: MissionStatus.STARTED,
        remote: false,
        isRewarded: false,
        expiresAt: new Date(Date.now() + 3600000 * 2) // 2 hours expiry
      }
    })
    .filter((m) => m !== null)

  return missions
}
