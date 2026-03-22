import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import PublicMissionModel from 'models/PublicMission'
import MissionModel from 'models/Mission'
import AtcModel from 'models/Atc'
import NftModel from 'models/Nft'
import LiveModel from 'models/Live'
import { PublicMissionStatus, MissionStatus, aircraftNameToIcaoCode } from 'types'
import { getEstimatedTimeMinutes, getMissionWeight } from 'utils'
import { INft } from 'models/Nft'
import { ObjectId } from 'mongodb'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { missionId, aircraftId } = req.body

  if (!missionId || !aircraftId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // 0. Single-Reservation Check: User can only have one active mission or reservation
    const [hasActiveMission, hasPoolReservation] = await Promise.all([
      MissionModel.exists({ userId: req.id, status: MissionStatus.STARTED }),
      PublicMissionModel.exists({
        reservedBy: new ObjectId(req.id as string),
        status: { $in: [PublicMissionStatus.RESERVED, PublicMissionStatus.ACTIVE] }
      })
    ])

    if (hasActiveMission || hasPoolReservation) {
      return res.status(204).end()
    }

    // 1. Fetch aircraft details to calculate performance
    const aircraftNft = await NftModel.findOne({ id: BigInt(aircraftId) }).lean()
    if (!aircraftNft) {
      return res.status(404).json({ error: 'Aircraft not found' })
    }
    const cruiseSpeedIcao =
      aircraftNameToIcaoCode[aircraftNft.metadata.name as keyof typeof aircraftNameToIcaoCode] || 'C172'

    // 2. Atomic reservation in the public pool
    const publicMission = await PublicMissionModel.findOneAndUpdate(
      {
        _id: missionId,
        status: PublicMissionStatus.AVAILABLE
      },
      {
        $set: {
          status: PublicMissionStatus.RESERVED,
          reservedBy: req.id,
          reservedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    ).lean()

    if (!publicMission) {
      return res.status(409).json({ error: 'Mission already reserved or not found' })
    }

    // 3. Check current ATC status for origin and destination
    const [originAtc, destAtc] = await Promise.all([
      AtcModel.exists({ 'atcPosition.airport.icao': publicMission.origin }),
      AtcModel.exists({ 'atcPosition.airport.icao': publicMission.destination })
    ])

    // 4. Create the personal mission record for tracking
    const userMission = await MissionModel.create({
      userId: req.id,
      origin: publicMission.origin,
      destination: publicMission.destination,
      distance: publicMission.distance,
      type: publicMission.type,
      category: publicMission.category,
      isSponsored: publicMission.isSponsored,
      rewardMultiplier: publicMission.rewardMultiplier,
      details: publicMission.details,
      prize: publicMission.prize,
      expiresAt: publicMission.expiresAt,
      originCoords: publicMission.originCoords,
      destinationCoords: publicMission.destinationCoords,
      aircraftId,
      callsign: publicMission.callsign,
      weight: getMissionWeight(aircraftNft as unknown as INft),
      status: MissionStatus.RESERVED,
      remote: false,
      isRewarded: false,
      estimatedTimeMinutes: getEstimatedTimeMinutes(publicMission.distance, cruiseSpeedIcao),
      originAtcOnStart: !!originAtc,
      destinationAtcOnStart: !!destAtc
    })

    // 5. Create Live session record (initial state)
    await LiveModel.findOneAndUpdate(
      { userId: req.id },
      {
        $set: {
          missionId: userMission._id,
          userId: req.id,
          aircraftId: userMission.aircraftId,
          callsign: userMission.callsign,
          isCompleted: false,
          track: { name: PublicMissionStatus.RESERVED, value: new Date() }
        }
      },
      { upsert: true, new: true }
    )

    res.status(201).json(userMission)
  } catch (error) {
    console.error('Reserve Mission ERROR =>', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default withAuth(handler)
