import AtcModel from 'models/Atc'
import VirtualAirlineModel from 'models/VirtualAirline'
import PilotModel from 'models/Pilot'
import UserModel from 'models/User'
import { MissionStatus, MissionType, ActiveAtc, Coords, MissionCategory } from 'types'
import { getDistanceByCoords, randomIntFromInterval, getRandomInt, getCallsign } from 'utils'
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
  ivaoVid: string
): Promise<{ icao: string; latitude: number; longitude: number } | null> => {
  let icao = 'LEMD' // Default

  // 1. Try Live IVAO Pilot data
  const vidNumber = Number(ivaoVid)
  if (!isNaN(vidNumber)) {
    const pilot = await PilotModel.findOne({ userId: vidNumber })
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
  }

  // 2. Try VirtualAirline lastLandedAt
  const va = await VirtualAirlineModel.findOne({ userId: ivaoVid })
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

export const generateMissionsForUser = async (user_id: string, aircraftId?: string, originIcao?: string) => {
  const user = await UserModel.findById(user_id)
  if (!user) return []
  
  const ivaoVid = user.id
  let location: { icao: string; latitude: number; longitude: number } | null = null

  if (originIcao) {
    const airportAtc = await AtcModel.findOne({ 'atcPosition.airport.icao': originIcao.toUpperCase() }).lean()
    if (airportAtc?.atcPosition?.airport) {
      location = {
        icao: originIcao.toUpperCase(),
        latitude: airportAtc.atcPosition.airport.latitude,
        longitude: airportAtc.atcPosition.airport.longitude
      }
    }
  }

  if (!location) {
    location = await getPlayerLocation(ivaoVid)
  }

  if (!location) return []

  // Check if origin itself has ATC
  const originHasAtc = await AtcModel.exists({ 'atcPosition.airport.icao': location.icao })

  // 1. Get sponsored destinations (Active ATCs elsewhere)
  const activeAtcs = await AtcModel.find({
    'atcPosition.airport.icao': { $ne: location.icao, $exists: true },
    'atcPosition.airport.latitude': { $exists: true }
  })
    .limit(10)
    .lean()

  // 2. Get solo destinations (Fixed list or common ones)
  const soloDestinations = [
    { icao: 'LEMG', latitude: 36.6749, longitude: -4.4991 },
    { icao: 'LEBL', latitude: 41.2971, longitude: 2.0785 },
    { icao: 'LEPA', latitude: 39.5517, longitude: 2.7388 },
    { icao: 'LEVC', latitude: 39.4893, longitude: -0.4816 },
    { icao: 'LEAL', latitude: 38.2822, longitude: -0.5582 },
    { icao: 'LPPT', latitude: 38.7813, longitude: -9.1359 },
    { icao: 'GCCC', latitude: 27.9319, longitude: -15.3866 }
  ].filter((d) => d.icao !== location.icao)

  const allDestinations = [
    ...activeAtcs.map(a => ({ ...a.atcPosition.airport, hasAtc: true })),
    ...soloDestinations.map(d => ({ ...d, hasAtc: false }))
  ]

  const missions = allDestinations.map((dest) => {
    const blueprint = MISSION_BLUEPRINTS[getRandomInt(MISSION_BLUEPRINTS.length)]
    const distance = getDistanceByCoords(
      { latitude: location.latitude, longitude: location.longitude } as Coords,
      { latitude: dest.latitude, longitude: dest.longitude } as Coords
    )

    const isSponsored = dest.hasAtc
    const rewardMultiplier = isSponsored ? 1.5 : (originHasAtc ? 1.2 : 0.8)
    const basePrize = (50 + distance * 1.1) * blueprint.multiplier

    return {
      userId: new ObjectId(user_id),
      origin: location.icao,
      destination: dest.icao || 'UNKNOWN',
      originCoords: { latitude: location.latitude, longitude: location.longitude },
      destinationCoords: { latitude: dest.latitude, longitude: dest.longitude },
      distance: Math.round(distance),
      type: blueprint.type,
      category: isSponsored ? MissionCategory.ATC : MissionCategory.SOLO,
      isSponsored,
      rewardMultiplier,
      details: {
        name: `[${isSponsored ? 'Sponsored' : 'Solo'}] ${blueprint.name}`,
        description: isSponsored 
          ? `${blueprint.description} Dedicated ATC coverage at destination (${dest.icao}). Premium rewards!` 
          : originHasAtc 
            ? `${blueprint.description} Controlled departure from ${location.icao}. Enhanced rewards.`
            : `${blueprint.description} Standard solo flight. Standard rewards.`
      },
      aircraftId,
      callsign: getCallsign(),
      weight: randomIntFromInterval(500, 5000),
      prize: Math.round(basePrize * rewardMultiplier),
      status: MissionStatus.STARTED,
      remote: false,
      isRewarded: false,
      expiresAt: new Date(Date.now() + 3600000 * 2)
    }
  })

  // Ensure we have at least some missions of each type if available
  const sponsored = missions.filter(m => m.isSponsored)
  const solo = missions.filter(m => !m.isSponsored)
  
  const finalMissions = [
    ...sponsored.slice(0, 6),
    ...solo.slice(0, 4)
  ]

  return finalMissions
    .filter((m) => m !== null)
    .sort(() => 0.5 - Math.random())
}
