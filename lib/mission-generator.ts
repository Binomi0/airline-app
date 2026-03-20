import AtcModel from 'models/Atc'
import VirtualAirlineModel from 'models/VirtualAirline'
import PilotModel from 'models/Pilot'
import UserModel from 'models/User'
import { MissionStatus, MissionType, Coords, MissionCategory, PublicMissionStatus } from 'types'
import { getDistanceByCoords, randomIntFromInterval, getRandomInt, getCallsign, getMissionAttributes } from 'utils'
import { ObjectId } from 'mongodb'
import NftModel, { INft } from 'models/Nft'
import PublicMissionModel from 'models/PublicMission'

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
    description: 'Entrega urgente de mercancías.',
    multiplier: 1.05
  },
  {
    type: MissionType.PASSENGER,
    name: 'Regional Shuttle',
    description: 'Transporte de pasajeros.',
    multiplier: 1.0
  },
  {
    type: MissionType.HUMANITARIAN,
    name: 'Medical Supplies',
    description: 'Suministros médicos urgentes.',
    multiplier: 1.15
  },
  {
    type: MissionType.VIP,
    name: 'VIP Charter',
    description: 'Transporte de lujo.',
    multiplier: 1.25
  }
]

const MAJOR_HUBS = [
  { icao: 'LEMD', latitude: 40.4839, longitude: -3.5679 },
  { icao: 'LEBL', latitude: 41.2971, longitude: 2.0785 },
  { icao: 'LEMG', latitude: 36.6749, longitude: -4.4991 },
  { icao: 'LEPA', latitude: 39.5517, longitude: 2.7388 },
  { icao: 'LEVC', latitude: 39.4893, longitude: -0.4816 },
  { icao: 'LPPT', latitude: 38.7813, longitude: -9.1359 },
  { icao: 'GCCC', latitude: 27.9319, longitude: -15.3866 }
]

const MISSION_POOL_SIZE = 50 // Increased pool size to accommodate more variety

export const generatePublicMissionPool = async () => {
  console.info('[MissionPool] Replenishing mission pool...')
  
  // 1. Get current active ATCs to use as mandatory origins
  const activeAtcs = await AtcModel.find({
    'atcPosition.airport.icao': { $exists: true },
    'atcPosition.airport.latitude': { $exists: true }
  }).lean()

  const atcOrigins = activeAtcs.map(a => ({
    icao: a.atcPosition.airport.icao,
    latitude: a.atcPosition.airport.latitude,
    longitude: a.atcPosition.airport.longitude,
    hasAtc: true
  }))

  const uniqueAtcOrigins = Array.from(new Map(atcOrigins.map(a => [a.icao, a])).values())

  // Combine with hubs for destinations variety
  const allDestinations = [
    ...uniqueAtcOrigins,
    ...MAJOR_HUBS.map(h => ({ ...h, hasAtc: false }))
  ]
  const uniqueDestinations = Array.from(new Map(allDestinations.map(a => [a.icao, a])).values())

  // 2. Get existing routes in the pool to avoid duplicates
  const existingMissions = await PublicMissionModel.find({ 
    status: PublicMissionStatus.AVAILABLE 
  }).select('origin destination').lean()
  
  const existingRoutes = new Set(existingMissions.map(m => `${m.origin}-${m.destination}`))
  const newMissions = []

  // Shuffle origins to provide different variety each time
  const shuffledOrigins = uniqueAtcOrigins.sort(() => Math.random() - 0.5)
  
  // 3. Guarantee missions for each ATC origin
  for (const origin of shuffledOrigins) {
    // For each tier, generate at least one mission if possible
    if (newMissions.length + existingMissions.length >= MISSION_POOL_SIZE) break

    const tiers = [
      { min: 20, max: 150 },   // Short
      { min: 151, max: 500 },  // Medium
      { min: 501, max: 2500 }  // Long
    ]

    for (const tier of tiers) {
      // Find eligible destinations within this range
      let possibleDests = uniqueDestinations.filter(d => {
        if (d.icao === origin.icao) return false
        if (existingRoutes.has(`${origin.icao}-${d.icao}`)) return false // Skip existing routes
        
        const dist = getDistanceByCoords(
          { latitude: origin.latitude, longitude: origin.longitude } as Coords,
          { latitude: d.latitude, longitude: d.longitude } as Coords
        )
        return dist >= tier.min && dist <= tier.max
      })

      if (possibleDests.length > 0) {
        // Shuffle to avoid picking the same one first consistently
        possibleDests = possibleDests.sort(() => Math.random() - 0.5)
        
        // Pick only ONE destination per tier to ensure maximum spread
        const destination = possibleDests[0]
        const mission = createMissionData(origin, destination)
        newMissions.push(mission)
        existingRoutes.add(`${origin.icao}-${destination.icao}`)
      } else {
        console.warn(`[MissionPool] No destinations in tier ${tier.min}-${tier.max} for ${origin.icao}`)
      }
    }
  }

  // 4. Fill up remaining slots with random unique routes if needed
  let remaining = MISSION_POOL_SIZE - (existingMissions.length + newMissions.length)
  let attempts = 0
  while (remaining > 0 && attempts < 100) {
    attempts++
    const origin = uniqueDestinations[getRandomInt(uniqueDestinations.length)]
    const destination = uniqueDestinations[getRandomInt(uniqueDestinations.length)]
    
    if (origin.icao !== destination.icao && !existingRoutes.has(`${origin.icao}-${destination.icao}`)) {
        newMissions.push(createMissionData(origin, destination))
        existingRoutes.add(`${origin.icao}-${destination.icao}`)
        remaining--
    }
  }

  if (newMissions.length > 0) {
    // Final shuffle to ensure different origins/destinations are mixed in the insertion order
    const shuffledMissions = newMissions.sort(() => Math.random() - 0.5)
    await PublicMissionModel.insertMany(shuffledMissions)
    console.info('[MissionPool] Added %d new missions to the pool', shuffledMissions.length)
  }
}

// Helper to centralize mission creation logic
const createMissionData = (origin: { icao: string, latitude: number, longitude: number, hasAtc: boolean }, destination: { icao: string, latitude: number, longitude: number, hasAtc: boolean }) => {
    const blueprint = MISSION_BLUEPRINTS[getRandomInt(MISSION_BLUEPRINTS.length)]
    const distance = getDistanceByCoords(
      { latitude: origin.latitude, longitude: origin.longitude } as Coords,
      { latitude: destination.latitude, longitude: destination.longitude } as Coords
    )

    
    const isSponsored = destination.hasAtc
    const rewardMultiplier = isSponsored ? 1.25 : (origin.hasAtc ? 1.1 : 1.0)
    const basePrize = (50 + distance * 1.1) * blueprint.multiplier

    const startTime = new Date()
    // Random start delay (up to 30 mins)
    startTime.setMinutes(startTime.getMinutes() + getRandomInt(30))
    
    const durationHours = randomIntFromInterval(2, 6)
    const endTime = new Date(startTime.getTime() + durationHours * 3600000)

    return {
      origin: origin.icao,
      destination: destination.icao,
      originCoords: { latitude: origin.latitude, longitude: origin.longitude },
      destinationCoords: { latitude: destination.latitude, longitude: destination.longitude },
      distance: Math.round(distance),
      type: blueprint.type,
      category: isSponsored ? MissionCategory.ATC : MissionCategory.SOLO,
      isSponsored,
      rewardMultiplier,
      details: {
        name: `[${isSponsored ? 'Sponsored' : 'Solo'}] ${blueprint.name}`,
        description: isSponsored 
          ? `${blueprint.description} Cobertura ATC dedicada en destino (${destination.icao}). ¡Recompensas Premium!` 
          : origin.hasAtc 
            ? `${blueprint.description} Salida controlada desde ${origin.icao}. Recompensas mejoradas.`
            : `${blueprint.description} Vuelo estándar en solitario. Recompensas base.`
      },
      basePrize: Math.round(basePrize / 100),
      prize: Math.round((basePrize * rewardMultiplier) / 100),
      status: PublicMissionStatus.AVAILABLE,
      startTime,
      endTime,
      expiresAt: endTime
    }
}

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

  // Get aircraft range if aircraftId is provided
  let rangeLimit = Infinity
  if (aircraftId && aircraftId !== 'undefined' && aircraftId !== '') {
    try {
      console.log('Fetching range for aircraftId:', aircraftId)
      // Use BigInt for the lookup as the schema defines id as BigInt
      const aircraftNft = await NftModel.findOne({ id: BigInt(aircraftId) }).lean()
      if (aircraftNft) {
        const attrs = getMissionAttributes(aircraftNft as unknown as INft)
        const rangeAttr = attrs.find(a => a.trait_type === 'range')
        console.log('Aircraft attributes found:', attrs.length, 'Range attribute:', rangeAttr)
        if (rangeAttr) {
          // Range is usually in KM in our metadata (e.g. 1289 for C172)
          // Distance from getDistanceByCoords is also roughly in KM-equivalent units
          rangeLimit = Number(rangeAttr.value) * 0.9 // Let's use 90% as a safety margin
          console.log('Range limit set to (90%):', rangeLimit)
        }
      } else {
        console.warn('Aircraft NFT not found for ID:', aircraftId)
        // If not found, we could default to Cessna 172 range as a safety measure for new users
        rangeLimit = 1289 * 0.9
      }
    } catch (error) {
      console.error('Error fetching aircraft range:', error)
    }
  } else {
    // Default range for users without a selected aircraft (Cessna 172 range)
    rangeLimit = 1200
  }

  const filteredDestinations = allDestinations.filter(dest => {
    const d = getDistanceByCoords(
      { latitude: location!.latitude, longitude: location!.longitude } as Coords,
      { latitude: dest.latitude, longitude: dest.longitude } as Coords
    )
    const isWithinRange = d <= rangeLimit
    // console.log(`Checking destination ${dest.icao}: distance ${d.toFixed(0)} <= ${rangeLimit.toFixed(0)} => ${isWithinRange}`)
    return isWithinRange
  })

  // Fallback if no destinations are within range, but don't just return everything
  // return at least the 3 closest ones even if they exceed range slightly
  let finalDestinations = filteredDestinations
  if (finalDestinations.length === 0) {
    console.warn('No destinations within range, falling back to 3 closest.')
    finalDestinations = allDestinations
      .map(dest => ({
        ...dest,
        dist: getDistanceByCoords(
          { latitude: location!.latitude, longitude: location!.longitude } as Coords,
          { latitude: dest.latitude, longitude: dest.longitude } as Coords
        )
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3)
  }

  const missions = finalDestinations.map((dest) => {
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
      prize: Math.round((basePrize * rewardMultiplier) / 100),
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
    .sort((a, b) => a.distance - b.distance)
}
